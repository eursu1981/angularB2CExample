// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authorityDomain: 'test.b2clogin.com',
  scopes: [
    'https://test.onmicrosoft.com/{id}/read',
  ],
  dataServiceConfig: {
    restApiServerUrl: 'https://test.azure-api.net/demo',
    ocpApimSubscriptionKey: '',
  },
  adb2cConfig: {
    spaClientId: '',
    signInSignUpAuthority:
      'https://test.b2clogin.com/test.onmicrosoft.com/B2C_1A_signup_signin',
    signInAuthority:
      'https://test.b2clogin.com/test.onmicrosoft.com/B2C_1_signin',
    signUpAuthority:
      'https://test.b2clogin.com/test.onmicrosoft.com/B2C_1_signup',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
