import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QuestionsComponent} from "./questions.component";
import {QuestionOverviewComponent} from "./pages/question-overview/question-overview.component";
import {QuestionProfileComponent} from "./pages/question-profile/question-profile.component";
import {QuestionProfileResolverService} from "./pages/question-profile/question-profile-resolver.service";

const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
    children: [
      {
        path: '',
        component: QuestionOverviewComponent,
      },
      {
        path: ':id',
        component: QuestionProfileComponent,
        resolve: {
          data: QuestionProfileResolverService,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
