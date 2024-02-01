import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../error-message.service';

@Component({
  selector: 'lpi-fill-in',
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.css',
})
export class FillInComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  currentQuestion: Question;
  givenAnswer: string;

  constructor(
    private qHandler: QuestionHandlingService,
    private errorMsgServ: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'fill') {
        this.currentQuestion = question;
        this.givenAnswer = '';
        if (question.answered === true) {
          if (question.givenAnswer) this.givenAnswer = question.givenAnswer;
        }
      }
    });
    this.subValidaton = this.qHandler.startValidation$.subscribe((type) => {
      if (type === 'fill') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    if (this.givenAnswer === '' || this.givenAnswer === null) {
      this.errorMsgServ.noAnswer();
      return;
    }
    this.currentQuestion.givenAnswer = this.givenAnswer;
    if (this.givenAnswer === this.currentQuestion.fillInAnswer)
      this.currentQuestion.correct = true;

    this.qHandler.handleValidation();
  }
}
