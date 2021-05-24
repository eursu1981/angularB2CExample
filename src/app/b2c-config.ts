import { environment } from 'src/environments/environment';

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signIn: 'B2C_1_signin',
    signUp: 'B2C_1_signup',
    signInSignUp: 'B2C_1A_signup_signin',
  },
  authorities: {
    signInSignUp: {
      authority: environment.adb2cConfig.signInSignUpAuthority,
    },
    signIn: {
      authority: environment.adb2cConfig.signInAuthority,
    },
    signUp: {
      authority: environment.adb2cConfig.signUpAuthority,
    },
  },
  authorityDomain: environment.authorityDomain,
};

/**
 * Enter here the coordinates of your Web API and scopes for access token request
 * The current application coordinates were pre-registered in a B2C tenant.
 */
export const apiConfig: { scopes: string[]; uri: string } = {
  scopes: environment.scopes,
  uri: environment.dataServiceConfig.restApiServerUrl,
};
