import { Pipe, PipeTransform } from '@angular/core';
import {subjects} from "../../constants";

@Pipe({
  name: 'subjectType'
})
export class SubjectTypePipe implements PipeTransform {

  transform(value: string): string {
    return subjects.find(subject => subject.value === value)?.title;
  }
}
