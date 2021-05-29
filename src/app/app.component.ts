import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionType,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
  AuthenticationResult,
  AuthError,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppUser, LOCAL_STORAGE } from './authentication/app-user.model';
import { IdentityService } from './authentication/identity.service';
import { b2cPolicies } from './b2c-config';

interface Payload extends AuthenticationResult {
  idTokenClaims: {
    tfp?: string;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MSAL Angular v2 B2C Sample';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  userHasPermission: boolean = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    public identityService: IdentityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();
    // BroadcastService exposes a way to subscribe to messages regarding msal activity

    // If you wish to perform functions following redirects
    // subscribe to the inProgress$ observable, filtering for InteractionStatus.None.
    // This will ensure that there are no interactions in progress when performing the functions
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        let payload: Payload = <AuthenticationResult>result.payload;
        return result;
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.identityService.setLoggedInParam(this.loginDisplay);
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      activeAccount = this.authService.instance.getAllAccounts()[0];
      this.authService.instance.setActiveAccount(activeAccount);
    }

    if (activeAccount && activeAccount.idTokenClaims) {
      var user = new AppUser(activeAccount.idTokenClaims);
      this.identityService.setCurrentUser(user);
      this.userHasPermission = this.hasPermissions();
      this.cdr.detectChanges();
    }
  }

  // userFlowRequest - used for other flows like editProfile
  //   let editProfileFlowRequest = {
  //     scopes: ['something'],
  //     authority: b2cPolicies.authorities.editProfile.authority,
  //   };

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.route.url.indexOf('accessdenied') > 0) {
      this.route.navigateByUrl('/');
      this.cdr.detectChanges();
    }
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup({
            ...this.msalGuardConfig.authRequest,
            ...userFlowRequest,
          } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService
          .loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
          ...userFlowRequest,
        } as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  logout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
    this.identityService.currentUserSubject.next(new AppUser(null));
    this.identityService.setLoggedInParam(false);
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER_KEY);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  private hasPermissions(): boolean {
    var requiredPermissions = this.router.config.find((r) =>
      r.path?.includes('dataPage')
    )?.data?.permissions;
    return requiredPermissions && requiredPermissions.length >= 0
      ? this.identityService.userHasPermissions(requiredPermissions)
      : false;
  }
}
