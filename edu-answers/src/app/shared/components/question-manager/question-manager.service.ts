import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ApiService} from "../../services/api.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionManagerService {

  constructor(private api: ApiService) { }

  sendQuestion(title: string, desc: string, type: string) {
    return this.api.post(`/questions/add`, { title, desc, type})
    // return this.http.get(`${environment.apiRootUrl}/list`)
  }

  updateQuestion(title: string, desc: string, type: string, qID: string) {
    return this.api.patch(`/questions/${qID}`, { title, desc, type})
  }
}
