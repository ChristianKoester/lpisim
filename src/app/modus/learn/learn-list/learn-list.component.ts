import { Component, OnInit } from '@angular/core';
import { QuestionApiService } from '../../../shared/question-api.service';
import { Question } from '../../../shared/question.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'lpi-learn-list',
  templateUrl: './learn-list.component.html',
  styleUrl: './learn-list.component.css'
})
export class LearnListComponent implements OnInit {
  questions$: Observable<Question[]>;

  constructor(
    private qServ: QuestionApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const collection = params.get('collection');
      this.questions$ = this.qServ.getQuestions(collection);
    });
  }
}
