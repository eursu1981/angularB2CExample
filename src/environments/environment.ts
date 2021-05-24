// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authorityDomain: 'devartcoreorg.b2clogin.com',
  scopes: [
    'https://devartcoreorg.onmicrosoft.com/f3933a3b-1a4a-480c-baac-5038139d3492/read',
  ],
  dataServiceConfig: {
    restApiServerUrl: 'https://dac-api-management.azure-api.net/demo',
    ocpApimSubscriptionKey: 'e37d852393f1465daea854d2067e2b90',
  },
  adb2cConfig: {
    spaClientId: '2be63142-fc11-44ac-9ad1-e3d211ee4f80',
    signInSignUpAuthority:
      'https://devartcoreorg.b2clogin.com/devartcoreorg.onmicrosoft.com/B2C_1A_signup_signin',
    signInAuthority:
      'https://devartcoreorg.b2clogin.com/devartcoreorg.onmicrosoft.com/B2C_1_signin',
    signUpAuthority:
      'https://devartcoreorg.b2clogin.com/devartcoreorg.onmicrosoft.com/B2C_1_signup',
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
