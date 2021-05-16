import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {subjects} from "../../../../shared/constants";
import {debounceTime, distinctUntilChanged, filter, startWith, tap} from "rxjs/operators";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {combineLatest} from "rxjs";
import {QuestionListService} from "../../../../shared/components/question-list/question-list.service";

@UntilDestroy()
@Component({
  selector: 'qna-question-overview',
  templateUrl: './question-overview.component.html',
  styleUrls: ['./question-overview.component.scss']
})
export class QuestionOverviewComponent implements OnInit {
  filterForm: FormGroup;

  subjects = subjects;

  questions = [];

  loading: boolean = true;

  enableLoadMoreBtn = true;

  page = 1;

  size = 3;

  constructor(
    private formBuilder: FormBuilder,
    private questionListService: QuestionListService,
  ) {
    this.createFilterForm();
    this.listenForFormValueChanges();
  }

  ngOnInit(): void {
  }

  loadMore() {
    const {search, filter} = this.filterForm.value;
    this.page += this.page
    this.getQuestionsList(search, filter, this.page, this.size);
  }

  private createFilterForm() {
    this.filterForm = this.formBuilder.group({
      search: '',
      filter: this.subjects[0].value,
    });
  }

  private listenForFormValueChanges() {
    combineLatest([
      this.filterForm.controls.search.valueChanges
        .pipe(
          debounceTime(400),
          filter(value => value.length >= 3 || value === ''),
          startWith(''),
        ),
      this.filterForm.controls.filter.valueChanges
        .pipe(startWith(this.filterForm.controls.filter.value))
    ]).pipe(
      untilDestroyed(this),
      distinctUntilChanged(),
    ).subscribe(([search, filter]) => {
      this.questions = [];
      this.page = 1;
      this.getQuestionsList(search, filter, this.page, this.size)
    })
  }

  private getQuestionsList(search, filter, page, size) {
    this.loading = true;
    this.questionListService.getQuestions(page, size, search, filter).subscribe((res: any[]) => {
      this.loading = false;
      this.enableLoadMoreBtn = res.length === this.size;
      this.questions = [...this.questions, ...res];
    })
  }

}
