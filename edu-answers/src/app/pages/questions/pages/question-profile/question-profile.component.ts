import { Component, OnInit } from '@angular/core';
import {QuestionsService} from "../../questions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {MatDialog} from "@angular/material/dialog";
import {QuestionManagerComponent} from "../../../../shared/components/question-manager/question-manager.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ConfirmationDialogComponent} from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {UserStorageService} from "../../../../shared/services/user-storage.service";
import {TranslateService} from "@ngx-translate/core";

@UntilDestroy()
@Component({
  selector: 'qna-question-profile',
  templateUrl: './question-profile.component.html',
  styleUrls: ['./question-profile.component.scss']
})
export class QuestionProfileComponent implements OnInit {

  answerForm: FormGroup;

  question;

  qID: string;

  topStarsAmount: number;

  loading;

  get getAnswerErrorMessage(): string {
    const {text} = this.answerForm.controls

    if (text?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
    if (text?.hasError('minlength')) {
      return `Šis lauks ir jābūt vismaz ${text.errors.minlength.requiredLength} zīmes garš`;
    }
  }

  constructor(
    public userStorageService: UserStorageService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private questionsService: QuestionsService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private router: Router,
  ) {
    this.qID = this.activatedRoute.snapshot.paramMap.get('id');
    this.createForm();
    this.activatedRoute.data
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        console.log(res);
        this.prepareQuestionData(res.data);
      });
  }

  ngOnInit(): void {
  }

  editQuestion() {
    const dialogRef = this.dialog.open(
      QuestionManagerComponent, {
        data: this.question,
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(updatedQuestion => {
        this.question = {...this.question, ...updatedQuestion};
      });
  }

  toggleStar(answer) {
    if (this.userStorageService.userID) {
      if (answer.isStarred) {
        this.questionsService.deleteStar(answer._id).subscribe(res => {
          answer.starNumber--;
          answer.isStarred = false;
        })

      } else {
        this.questionsService.addStar(answer._id).subscribe(res => {
          answer.starNumber++;
          answer.isStarred = true;
        })

      }
    } else {
      this.snackBarService.addNotification('Lūdzu autorizējies, lai novērtētu atbildi.')
    }
  }

  deleteQuestion() {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent, {
        data: {
          title: 'Vai tiešām izdzēst jautajumu?',
          desc: 'Šo darbību vairs nevarēs atcelt.',
        }
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          this.questionsService.deleteQuestion(this.qID).subscribe(res => {
            this.router.navigate([''])
            this.snackBarService.addNotification('Jusu jautajums tika izdzests')
          }, err => {
            this.snackBarService.addNotification('Notika kļūda');
          })
        }
      });
  }

  deleteAnswer(answerID) {

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent, {
        data: {
          title: 'Vai tiešām izdzēst atbildi?',
          desc: 'Šo darbību vairs nevarēs atcelt.',
        }
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          this.questionsService.deleteAnswer(answerID).subscribe(res => {
            const filteredAnswers = this.question.answers.filter(answer => answer._id !== answerID)
            this.snackBarService.addNotification('Atbilde tika izdzēsta');
            this.question.answers = filteredAnswers
          }, err => {
            this.snackBarService.addNotification('Notika kļūda');
          })
        }
      });
  }

  onFormSubmit() {

    if (this.answerForm.valid) {
      this.loading = true;
      const {text} = this.answerForm.value;
      this.questionsService.saveAnswer(this.qID, text).subscribe(answer => {
        const {answers} = this.question
        this.question.answers = [
          {...answer, isStarred: false, starNumber: 0},
          ...answers
        ];
        this.answerForm.reset();
        this.answerForm.controls.text.setErrors(null);
        this.loading = false;
      }, err => {
        this.snackBarService.addNotification('Notikusi kļūda pievienojot atbildi.')
        this.loading = false;
      })
    }

  }

  private createForm() {
    this.answerForm = this.formBuilder.group({
      text: ['', Validators.minLength(3)],
    });
  }

  private getQuestion() {
    this.questionsService.getQuestion(this.qID).subscribe((res: any) => {
      this.prepareQuestionData(res);
    })
  }

  private prepareQuestionData(data) {
    const {question, answers} = data;

    const preparedAnswers = answers.map(answer => ({
      ...answer,
      isStarred: answer.stars.find(star => star.user_id === this.userStorageService.userID),
      starNumber: answer.stars.length,
    }));

    const sortedAnswers = preparedAnswers.sort((currAnswer, nextAnswer) =>
      currAnswer.starNumber > nextAnswer.starNumber ? -1 : 1);

    this.topStarsAmount = sortedAnswers[0]?.starNumber;

    this.question = {
      ...question,
      answers: sortedAnswers,
    };
  }

}
