import { Component } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionApiService } from '../../../shared/question-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'lpi-learn-single',
  templateUrl: './learn-single.component.html',
  styleUrl: './learn-single.component.css'
})
export class LearnSingleComponent {
  question$: Observable<Question>;
  showSolution: boolean = false;
  collection: string = '';
  id: number = 1;

  constructor(
    private qServ: QuestionApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.collection = params.get('collection');
      this.showSolution = false;
      this.question$ = this.qServ.getQuestion(this.collection, this.id);
    });
  }

  onToggleSolution() {
    this.showSolution = !this.showSolution;
  }

  onNextQuestion() {
    this.router.navigateByUrl(`/learn/single/${this.collection}/${this.id + 1}`);
  }

  onPreviousQuestion() {
    this.router.navigateByUrl(`/learn/single/${this.collection}/${this.id - 1}`);
  }
}
