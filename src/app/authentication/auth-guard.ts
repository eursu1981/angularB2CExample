import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeComponent } from '../home/home.component';
import { AppUser } from './app-user.model';
import { IdentityService } from './identity.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private identityService: IdentityService,
    private authService: MsalService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkAuthorization(route, state).then((res: boolean) => {
      if (!res) {
        this.router.navigateByUrl('/accessdenied');
      }
      return res;
    });
  }

  checkAuthorization(
    targetRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((res, rej) => {
      if (this.authService.instance.getActiveAccount()) {
        res(
          this.identityService.userHasPermissions(targetRoute.data.permissions)
        );
      } else {
        var account = this.authService.instance.getAllAccounts()[0];
        if (account) {
          this.authService
            .acquireTokenSilent(<SilentRequest>{
              correlationId: environment.adb2cConfig.spaClientId,
              authority: environment.adb2cConfig.signInSignUpAuthority,
              forceRefresh: true,
              account: account,
            })
            .toPromise()
            .then((result) => {
              if (result?.account) {
                this.authService.instance.setActiveAccount(result?.account);
                alert('You were silently logged in !');
                this.identityService.setCurrentUser(
                  new AppUser(result?.account.idTokenClaims)
                );

                if (targetRoute.component === HomeComponent) {
                  res(true);
                }

                if (!targetRoute.data || !targetRoute.data.permissions) {
                  res(true);
                }

                res(
                  this.identityService.userHasPermissions(
                    targetRoute.data.permissions
                  )
                );
              }
            })
            .catch((ex) => {
              alert(
                'Something went wrong, you will be redirected to login page.'
              );
              this.authService.loginRedirect();
              res(false);
            });
        } else {
          res(false);
        }
      }
    });
  }
}
