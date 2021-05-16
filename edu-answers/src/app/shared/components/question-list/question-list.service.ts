import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionListService {

  constructor(
    private api: ApiService
  ) { }

  getQuestions(page: number, size: number, search: string, filter: string, userID = '') {
    return this.api.get(`/questions/list`, {page, size, search, filter, userID});
  }
}
