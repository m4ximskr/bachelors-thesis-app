import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {UserStorageService} from "../services/user-storage.service";

@Injectable({
  providedIn: 'root'
})
export class LoginAndRegistrationGuard implements CanActivate {
  constructor(
    private router: Router,
    private userStorageService: UserStorageService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userStorageService.userID) {
      this.router.navigate(['/']);
      return false
    }
    return true;
  }

}
