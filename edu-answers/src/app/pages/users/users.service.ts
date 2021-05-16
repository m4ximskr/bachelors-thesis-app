import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../shared/services/api.service";

export interface UserData {
  _id: number;
  name: string;
  email: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  getUserData() {
    return this.api.get(`/users/me`);
  }

  updateUserData(name: string, email: string) {
    return this.api.patch('/users/update', {name, email})
  }

  updateUserPassword(password: string, newPassword: string) {
    return this.api.patch('/users/update/password', {password, newPassword})
  }

  getUsers(search: string) {
    return this.api.get(`/users`, {search});
  }

  deleteUser(id: string) {
    return this.api.delete(`/users/${id}`);
  }
}
