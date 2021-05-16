import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../users.service";
import {MatDialog} from "@angular/material/dialog";
import {
  UpdateUserDialogType,
  UpdateUserParamDialogComponent
} from "./components/update-user-param-dialog/update-user-param-dialog.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {UpdateUserPasswordDialogComponent} from "./components/update-user-password-dialog/update-user-password-dialog.component";
import {QuestionListService} from "../../../../shared/components/question-list/question-list.service";

@UntilDestroy()
@Component({
  selector: 'qna-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userGeneralData;
  questions = [];
  loading: boolean = true;
  enableLoadMoreBtn = true;
  page = 1;
  size = 3;

  constructor(
    public dialog: MatDialog,
    private usersService: UsersService,
    private questionListService: QuestionListService,
  ) { }

  ngOnInit(): void {
    this.usersService.getUserData().subscribe((res: any) => {
      console.log(res);
      this.userGeneralData = res;
      this.getQuestionList(this.page, this.size);
    })
  }

  openDialog(type: UpdateUserDialogType) {
    const dialogRef = this.dialog.open(
      UpdateUserParamDialogComponent, {
        data: {
          userData: this.userGeneralData,
          type,
        },
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(updatedGeneralData => {
        if (updatedGeneralData) {
          this.userGeneralData = updatedGeneralData;
        }
      });
  }

  openPasswordDialog() {
    const dialogRef = this.dialog.open(UpdateUserPasswordDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        console.log(res);
      });
  }

  loadMore() {
    this.page += this.page;
    this.getQuestionList(this.page, this.size);
  }

  private getQuestionList(page: number, size: number) {
    this.loading = true;
    this.questionListService.getQuestions(page, size, '', '', this.userGeneralData._id).subscribe((res: any[]) => {
      this.loading = false;
      this.enableLoadMoreBtn = res.length === this.size;
      this.questions = [...this.questions, ...res];
    })
  }

}
