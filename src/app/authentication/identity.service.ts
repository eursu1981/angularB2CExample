import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser, LOCAL_STORAGE } from './app-user.model';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  currentUser$: Observable<AppUser>;
  currentUserSubject = new BehaviorSubject<AppUser>(new AppUser(null));

  isUserLoggedIn$: Observable<boolean>;
  isUserLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();
  }

  setLoggedInParam(isUserLoggedIn: boolean) {
    this.isUserLoggedInSubject.next(isUserLoggedIn);
  }

  setCurrentUser(currentUser: AppUser) {
    localStorage.setItem(
      LOCAL_STORAGE.CURRENT_USER_KEY,
      JSON.stringify(currentUser)
    );
    this.currentUserSubject.next(currentUser);
  }

  userHasPermissions(requiredPermissions: string[]): boolean {
    const userPermissions = this.currentUserSubject.getValue()?.permissions;
    const isUserLoggedIn = this.isUserLoggedInSubject.getValue();

    if (!requiredPermissions || requiredPermissions.length == 0) {
      return true;
    }
    if (userPermissions && userPermissions.length > 0) {
      const filteredArray = requiredPermissions.filter((value) =>
        userPermissions.includes(value)
      );
      return filteredArray.length > 0;
    }
    return false;
  }
}
