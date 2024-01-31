import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrl: './single-choice.component.css',
})
export class SingleChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidation: Subscription;
  currentQuestion: Question;
  selectedAnswer: number;

  constructor(
    private qHandler: QuestionHandlingService,
  ) {}

  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'single') {
        this.currentQuestion = question;
        this.selectedAnswer = question.answers.findIndex((x) => x.chosen);
        if (this.selectedAnswer === -1) this.selectedAnswer = null;
      }
    });
    this.subValidation = this.qHandler.startValidation$.subscribe((type) => {
      if (type === 'single') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidation.unsubscribe();
  }

  validateAnswer() {
    if (this.selectedAnswer !== null) {
      this.currentQuestion.answers[this.selectedAnswer].chosen = true;
      if (this.currentQuestion.answers[this.selectedAnswer].correct) 
        this.currentQuestion.correct = true;
    //   else
    //     this.currentQuestion.correct = false;
    // } else {
    //   this.currentQuestion.correct = false;
    }
    this.qHandler.handleValidation();
  }
}
