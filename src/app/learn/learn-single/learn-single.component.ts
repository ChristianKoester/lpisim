import { Component } from '@angular/core';
import { Question } from '../../shared/question.model';
import { QuestionService } from '../../shared/question.service';
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
  id: number;

  constructor(
    private qServ: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.showSolution = false;
      this.question$ = this.qServ.getQuestion('lpic101', this.id);
    });
  }

  onToggleSolution() {
    this.showSolution = !this.showSolution;
  }

  onNextQuestion() {
    this.router.navigateByUrl(`/learn/single/${this.id + 1}`);
  }

  onPreviousQuestion() {
    this.router.navigateByUrl(`/learn/single/${this.id - 1}`);
  }
}
