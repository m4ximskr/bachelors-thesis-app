import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionManagerComponent} from "../question-manager/question-manager.component";

@Component({
  selector: 'qna-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<QuestionManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, desc: string },
  ) { }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close(true);
  }

}
