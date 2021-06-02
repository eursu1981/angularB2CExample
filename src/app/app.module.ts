import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent,
} from '@azure/msal-angular';

import { b2cPolicies, apiConfig } from './b2c-config';
import { DataPageComponent } from './data-page/data-page.component';
import { environment } from 'src/environments/environment';
import { AccessDeniedComponent } from './authentication/access-denied/access-denied.component';
import { AuthGuard } from './authentication/auth-guard';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

// To configure MSAL authentication we need to create a factory method
// and let it return a new configuration object including our configuration parameters
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // Application Id of app registered in B2C
      clientId: environment.adb2cConfig.spaClientId,
      // signup-signin user flow
      authority: b2cPolicies.authorities.signInSignUp.authority,
      //the location where the authorization server sends the user once
      //the app has been successfully authorized and granted an authorization code or access token
      redirectUri: '/',
      // your app logout redirect uri
      postLogoutRedirectUri: '/',
      //a URL that indicates a directory that MSAL can request tokens from
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}
// mapping table of endpoints and scopes that we want to create access tokens for.
// The idea here is that every time a request is made to one of the provided protected resources
// in that mapping table, the MSAL library is acquiring a matching access token in the background and
// passes it into the request’s authorization header
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(apiConfig.uri, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    // Setting the interaction type determines how the MsalGuard will interactively prompt for login
    interactionType: InteractionType.Redirect,
    authRequest: {
      // Sets the scopes, which the user will need to consent to,
      // for gaining permission to access specific parts of a resource protected by scopes
      // the access token issued to the application will be limited to the scopes granted
      scopes: [...apiConfig.scopes],
    },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    DataPageComponent,
    AccessDeniedComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule,
  ],
  providers: [
    {
      // This basically is the plumbing to intercept http requests and sneak in the access tokens
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    AuthGuard,
  ],
  // When using redirects with MSAL, it is mandatory to handle redirects with either the MsalRedirectComponent or handleRedirectObservable
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
