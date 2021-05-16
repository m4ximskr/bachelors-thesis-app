import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  get userID(): string {
    return localStorage.getItem('user_id');
  }

  get userType(): string {
    return localStorage.getItem('type');

  }

  constructor() { }

  setSession(id: string, type: string, accessToken: string, refreshToken: string) {
    console.log('sets')
    localStorage.setItem('user_id', id);
    localStorage.setItem('type', type);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  removeSession() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('type');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  userHasPermissions(userID = this.userID) {
    return this.userID === userID;
  }

  isAppropriateUser(userID = this.userID) {
    return this.userID === userID
  }

  isAdmin() {
    return this.userType === 'admin';
  }

  isDefaultUser() {
    return this.userType === 'default';
  }
}
