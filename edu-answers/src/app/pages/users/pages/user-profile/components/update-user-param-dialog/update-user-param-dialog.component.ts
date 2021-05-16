import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionManagerService} from "../../../../../../shared/components/question-manager/question-manager.service";
import {FormBuilder} from "@angular/forms";
import {UsersService} from "../../../../users.service";

export type UpdateUserDialogType = 'name' | 'email';

@Component({
  selector: 'qna-update-user-param-dialog',
  templateUrl: './update-user-param-dialog.component.html',
  styleUrls: ['./update-user-param-dialog.component.scss']
})
export class UpdateUserParamDialogComponent implements OnInit {

  form;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserParamDialogComponent>,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  onFormSubmit() {
    if (this.form.valid) {
      const {name, email} = this.form.value;
      this.usersService.updateUserData(name, email).subscribe((data: any) => {
        // console.log(res);
        this.dialogRef.close(data)
      })
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: this.data.userData.name,
      email: this.data.userData.email,
    });
  }

}
