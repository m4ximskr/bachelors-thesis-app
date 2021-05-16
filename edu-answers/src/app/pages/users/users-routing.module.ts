import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuestionsComponent} from "../questions/questions.component";
import {QuestionOverviewComponent} from "../questions/pages/question-overview/question-overview.component";
import {QuestionProfileComponent} from "../questions/pages/question-profile/question-profile.component";
import {UsersComponent} from "./users.component";
import {UserListComponent} from "./pages/user-list/user-list.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        component: UserListComponent,
        pathMatch: 'full',
        // canActivate: [PublishersOverviewGuard],
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        pathMatch: 'full',
        // canActivate: [PublisherGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
