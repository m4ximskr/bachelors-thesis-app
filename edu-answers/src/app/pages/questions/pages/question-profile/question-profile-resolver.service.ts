import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {QuestionsService} from "../../questions.service";
import {catchError} from "rxjs/operators";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {HttpErrorResponse} from "@angular/common/http";
import {EMPTY, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionProfileResolverService implements Resolve<any> {

  constructor(
    private questionsService: QuestionsService,
    private snackBarService: SnackBarService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const questionID = route.paramMap.get('id');
    console.log(questionID);
    return this.questionsService.getQuestion(questionID).pipe(
      catchError((err, caught) => {
        this.snackBarService.addNotification('Notika kļūda ielādējot jautājuma datus');
        this.router.navigateByUrl('');
        return EMPTY
      })
    )
  }
}
