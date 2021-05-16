import { Injectable } from '@angular/core';
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../shared/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  questions = [
    {
      id: 1,
      description: 'В вазе 12 гвоздик, среди которых 8 - красных. из вазы случайным образом выбирают 5 гвоздик. Какова вероятность того, что среди них окажется 2 красные гвоздики?',
      created_at: new Date(1620496155*1000),
      image_url: 'https://ru-static.z-dn.net/files/d06/73d026f87b61167c13cfb3d81aca6f4e.jpeg',
      creator: 'Iruna6690',
    }
  ]


  constructor(
    private api: ApiService,
  ) { }

  getQuestion(id: string) {
    return this.api.get(`/questions/${id}`);
  }

  saveAnswer(qID: string, text: string) {
    console.log('efw')
    return this.api.post(`/answers/add`, {qID, text})
  }

  deleteQuestion(id: string) {
    return this.api.delete(`/questions/${id}`)
  }

  deleteAnswer(answerID: string) {
    return this.api.delete(`/answers/${answerID}`)
  }

  addStar(answerID: string) {
    return this.api.post(`/stars/add`, {answerID})
  }

  deleteStar(answerID: string) {
    return this.api.delete(`/stars/${answerID}`)

  }

}
