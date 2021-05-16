import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../../../users.service";
import {Form, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'qna-update-user-password-dialog',
  templateUrl: './update-user-password-dialog.component.html',
  styleUrls: ['./update-user-password-dialog.component.scss']
})
export class UpdateUserPasswordDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserPasswordDialogComponent>,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.form.valid) {
      const {password, new_password} = this.form.value;
      this.usersService.updateUserPassword(password, new_password).subscribe((data: any) => {
        // console.log(res);
        this.dialogRef.close(data)
      })
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      password: '',
      new_password: '',
      confirm_new_password: '',
    });
  }

}
