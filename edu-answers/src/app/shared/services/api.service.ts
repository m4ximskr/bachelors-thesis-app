import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiRootUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string) {
    return this.http.post(`${this.apiRootUrl}/login`, {
      email,
      password
    }, {
      observe: 'response'
    })
  }

  get(path, params?) {
    const options = {
      params,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    return this.http.get(`${this.apiRootUrl}${path}`, options)
  }

  post(path, params) {
    return this.http.post(`${this.apiRootUrl}${path}`, params);
  }

  patch(path, params) {
    return this.http.patch(`${this.apiRootUrl}${path}`, params);
  }

  delete(path) {
    return this.http.delete(`${this.apiRootUrl}${path}`);
  }
}
