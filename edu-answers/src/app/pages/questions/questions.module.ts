import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsRoutingModule } from './questions-routing.module';
import { QuestionOverviewComponent } from './pages/question-overview/question-overview.component';
import { QuestionProfileComponent } from './pages/question-profile/question-profile.component';
import {QuestionsComponent} from "./questions.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SubjectTypeModule} from "../../shared/pipes/subject-type/subject-type.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {QuestionListModule} from "../../shared/components/question-list/question-list.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [QuestionsComponent, QuestionOverviewComponent, QuestionProfileComponent],
  exports: [
    QuestionOverviewComponent
  ],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SubjectTypeModule,
    MatProgressSpinnerModule,
    QuestionListModule,
    TranslateModule
  ]
})
export class QuestionsModule { }
