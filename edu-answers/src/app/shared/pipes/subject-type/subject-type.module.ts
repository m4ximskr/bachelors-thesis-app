import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubjectTypePipe} from "./subject-type.pipe";

@NgModule({
  declarations: [SubjectTypePipe],
  imports: [
    CommonModule
  ],
  exports: [SubjectTypePipe]
})
export class SubjectTypeModule { }
