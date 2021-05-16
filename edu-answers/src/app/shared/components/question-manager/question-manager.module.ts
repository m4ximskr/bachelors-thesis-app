import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestionManagerComponent} from "./question-manager.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [QuestionManagerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  exports: [QuestionManagerComponent]
})
export class QuestionManagerModule { }
