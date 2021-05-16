import {Component, Inject, OnInit} from '@angular/core';
import {QuestionManagerService} from "./question-manager.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {subjects} from "../../constants";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
  selector: 'qna-ask-question',
  templateUrl: './question-manager.component.html',
  styleUrls: ['./question-manager.component.scss']
})
export class QuestionManagerComponent implements OnInit {

  questionForm: FormGroup;

  subjects = subjects.slice(1);

  loading: boolean;

  get getTitleErrorMessage(): string {
    const {title} = this.questionForm.controls;
    if (title?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
  }

  get getDescErrorMessage(): string {
    const {description} = this.questionForm.controls;
    if (description?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
  }

  get getTypeErrorMessage(): string {
    const {type} = this.questionForm.controls;
    if (type?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
  }

  constructor(
    public dialogRef: MatDialogRef<QuestionManagerComponent>,
    private askQuestionService: QuestionManagerService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.questionForm.valid) {
      this.loading = true;
      const {title, description, type} = this.questionForm.value;
      this.askQuestionService[this.data ? 'updateQuestion' : 'sendQuestion']
        (title, description, type, this.data?._id).subscribe((question: any) => {
        this.loading = false;
        this.dialogRef.close(question)
        }, err => {
          this.loading = false;
          this.snackBarService.addNotification('Notikusi kļūda pievienojot jautājumu. Mēģiniet vēlreiz.')
      })
    }
  }

  private createForm() {
    this.questionForm = this.formBuilder.group({
      title: this.data?.title || '',
      description: this.data?.desc || '',
      type: this.data?.type || '',
    });
  }

}
