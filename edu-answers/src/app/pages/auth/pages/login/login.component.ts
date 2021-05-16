import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'qna-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loading: boolean;

  get getEmailErrorMessage(): string {
    if (this.loginForm.controls.email?.hasError('required')) {
      return 'Šis lauks ir obligāts';
    }
    return this.loginForm.controls.email?.hasError('email') ? 'Nepareizs email' : '';
  }

  get getPasswordErrorMessage(): string {
    const {password} = this.loginForm.controls;
    if (password?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
    if (password?.hasError('minlength')) {
      return `Šis lauks ir jabut vismaz ${password.errors.minlength.requiredLength} zimes gars`;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {
    this.createLoginForm();
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const {email, password} = this.loginForm.value
      this.authService.login(email, password).subscribe(res => {
        this.loading = false;
        this.router.navigate([''])
      }, err => {
        this.loading = false;
        this.snackBarService.addNotification('Notikusi kļūda autorizācijas laikā. Mēģiniet vēlreiz.')
      })
    }
  }

  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.minLength(8)],
    });
  }
}
