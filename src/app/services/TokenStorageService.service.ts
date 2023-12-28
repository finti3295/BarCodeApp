import { Injectable } from '@angular/core';
import { User } from '../_model/user';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  isLoggedIn = false;
  roles: string[] = [];
  constructor() {
    this.roles = this.getUser().roles;
   }

  signOut(): void {
    window.sessionStorage.clear();
    this.isLoggedIn = false;
    console.log("signOut isLoggedIn "+ this.isLoggedIn)
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    console.log("saveToken");
    console.log(token);
    var ret = window.sessionStorage.getItem(TOKEN_KEY);
    console.log("after saveToken");
    console.log(ret);
    this.isLoggedIn = true;
    // const user = this.getUser();
    // if (user.id) {
    //   this.saveUser({ ...user, accessToken: token });
    //}
  }

  public getToken(): string | null {
    var ret = window.sessionStorage.getItem(TOKEN_KEY);
    this.isLoggedIn = ret ? true: false;
    console.log("getToken");
    console.log(ret);
    return ret;
  }

  public saveRefreshToken(token: string): void {
    // window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    // window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public saveUser(user: User): void {
    console.log("saveUser");
    console.log(user);
    this.roles = user.role;
    this.saveToken(user.access_token);
    this.saveRefreshToken(user.refresh_token);
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}