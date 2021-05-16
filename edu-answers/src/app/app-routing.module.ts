import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginAndRegistrationGuard} from "./shared/guards/login-and-registration.guard";
import {AuthGuard} from "./shared/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'questions',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'questions',
    loadChildren: () =>
      import('./pages/questions/questions.module').then(m => m.QuestionsModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoginAndRegistrationGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
