import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import {UsersComponent} from "./users.component";
import {UserListComponent} from "./pages/user-list/user-list.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import { UpdateUserParamDialogComponent } from './pages/user-profile/components/update-user-param-dialog/update-user-param-dialog.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { UpdateUserPasswordDialogComponent } from './pages/user-profile/components/update-user-password-dialog/update-user-password-dialog.component';
import {QuestionListModule} from "../../shared/components/question-list/question-list.module";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";


@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserProfileComponent,
    UpdateUserParamDialogComponent,
    UpdateUserPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    QuestionListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule
  ]
})
export class UsersModule { }
