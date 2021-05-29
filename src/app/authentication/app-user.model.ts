export class AppUser {
  name: string;
  emailAddress: string;
  permissions: string[];
  userId: string;

  constructor(claims: any) {
    this.name =
      claims && claims.family_name && claims.name
        ? `${claims.family_name} ${claims.name}`
        : claims && claims.given_name
        ? claims.name
        : '';
    this.emailAddress = claims ? claims['emailAddress'] : '';
    this.permissions = claims ? claims.groups : [];
    this.userId = claims ? claims.sub : null;
  }
}

export const LOCAL_STORAGE = {
  CURRENT_USER_KEY: 'currentUser',
};
