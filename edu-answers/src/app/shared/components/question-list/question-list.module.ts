import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestionListComponent} from "./question-list.component";
import {RouterModule} from "@angular/router";
import {SubjectTypeModule} from "../../pipes/subject-type/subject-type.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [QuestionListComponent],
  imports: [
    CommonModule,
    RouterModule,
    SubjectTypeModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [QuestionListComponent]
})
export class QuestionListModule { }
