import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'qna-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  @Input() questions = [];
  @Input() loading: boolean;
  @Input() enableLoadMoreBtn = true;
  @Output() loadMore = new EventEmitter();

  constructor(
  ) {}

  ngOnInit(): void {
  }

}
