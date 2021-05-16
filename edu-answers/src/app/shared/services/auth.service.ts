import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {shareReplay, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {ApiService} from "./api.service";
import {UserStorageService} from "./user-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: ApiService,
    private userStorageService: UserStorageService,
  ) { }

  register(name: string, email: string, password: string) {
    return this.api.post('/users/register', {name, email, password})
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.apiRootUrl}/users/login`, {
      email,
      password
    }, {
      observe: 'response'
    }).pipe(
      shareReplay(),
      tap(res => {
        console.log(res);
        this.userStorageService.setSession(res.body['_id'], res.body['type'], res.headers.get('x-access-token'), res.headers.get('x-refresh-token'))
      })
    )
  }

  logout() {
    this.userStorageService.removeSession();
    this.router.navigate(['/auth/login']);
  }


}
