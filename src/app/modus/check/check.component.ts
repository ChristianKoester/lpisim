import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../shared/question.model';
import { Subscription } from 'rxjs';
import { ModusHandlingService } from '../shared/modus-handling.service';

@Component({
  selector: 'lpi-check',
  templateUrl: './check.component.html',
  styleUrl: './check.component.css',
})
export class CheckComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  private subValidation: Subscription;
  question: Question;
  numberQuestions: number;
  dialogVisible: boolean = false;

  constructor(
    private modusHandler: ModusHandlingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) =>
      this.modusHandler.loadQuestions(params.get('collection'), false)
    );
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      this.question = question;
      this.numberQuestions = this.modusHandler.questions.length;
    });
    this.subValidation = this.modusHandler.validationComplete$.subscribe(() =>
      this.handleValidation()
    );
  }

  ngOnDestroy(): void {
    this.subRoute.unsubscribe();
    this.subQuestion.unsubscribe();
    this.subValidation.unsubscribe();
  }

  onNextQuestion() {
    this.modusHandler.nextQuestion();
  }

  onPreviousQuestion() {
    this.modusHandler.previousQuestion();
  }

  onExit() {
    console.log('show results');
  }

  onSkip() {
    console.log('enqueue skiplist');
  }

  onSubmit() {
    this.modusHandler.validate();
  }

  handleValidation() {
    if (this.modusHandler.valid) {
      this.modusHandler.nextQuestion();
    } else {
      this.dialogVisible = true;
      this.modusHandler.previousQuestion();
    }
  }
}
