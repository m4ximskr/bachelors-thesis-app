import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TranslateService} from "@ngx-translate/core";

@UntilDestroy()
@Component({
  selector: 'edu-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  loading: boolean;

  get getNameErrorMessage(): string {
    const {name} = this.registerForm.controls;
    if (name?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
    if (name?.hasError('minlength')) {
      return `Šis lauks ir jābūt vismaz ${name.errors.minlength.requiredLength} zīmes garš`;
    }
  }

  get getEmailErrorMessage(): string {
    const {email} = this.registerForm.controls
    if (email?.hasError('required')) {
      return 'Šis lauks ir obligāts';
    }
    if (email?.hasError('email')) {
      return 'Nepareizs email'
    }
  }

  get getPasswordErrorMessage(): string {
    const {password} = this.registerForm.controls;
    if (password?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
    if (password?.hasError('minlength')) {
      return `Šis lauks ir jabut vismaz ${password.errors.minlength.requiredLength} zimes gars`;
    }
  }

  get getConfirmPasswordErrorMessage(): string {
    const {confirm_password} = this.registerForm.controls;
    if (confirm_password?.hasError('required')) {
      return 'Šis lauks ir obligāts'
    }
    if (confirm_password?.hasError('mustMatch')) {
      return 'Paroles nesakrit'
    }
  }

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {
    this.createRegisterForm();
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      const {password, confirm_password} = this.registerForm.controls;
      confirm_password.setErrors(password.value === confirm_password.value ? null : {mustMatch: true})
    })
  }

  onFormSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const {name, email, password} = this.registerForm.value
      this.authService.register(name, email, password).subscribe(() => {
        this.loading = false;
        this.router.navigate(['/auth/login'])
      }, err => {
        this.loading = false;
        this.snackBarService.addNotification(
          err?.error.keyPattern.email
            ? 'Lietotājs ar tādu ē-pastu jau eksistē.'
            : 'Notikusi kļūda reģistrācijas laikā. Mēģiniet vēlreiz.'
        );
      })
    }
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.minLength(3)],
      email: ['', Validators.email],
      password: ['', Validators.minLength(8)],
      confirm_password: [''],
    });
  }
}
