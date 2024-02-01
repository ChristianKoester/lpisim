import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../error-message.service';

@Component({
  selector: 'lpi-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrl: './multi-choice.component.css',
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  currentQuestion: Question;
  selectedAnswers: number[];

  constructor(
    private qHandler: QuestionHandlingService,
    private errorMsgServ: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'multi') {
        this.currentQuestion = question;
        this.selectedAnswers = [];
        if (question.answered === true) {
          for (let index = 0; index < question.answers.length; index++) {
            if (question.answers[index].chosen)
              this.selectedAnswers.push(index);
          }
        }
      }
    });
    this.subValidaton = this.qHandler.startValidation$.subscribe((type) => {
      if (type === 'multi') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    if (this.selectedAnswers.length === 0) {
      this.errorMsgServ.noAnswer();
      return;
    }

    for (let index = 0; index < this.currentQuestion.answers.length; index++) {
      if (this.selectedAnswers.includes(index)) {
        this.currentQuestion.answers[index].chosen = true;
      } else {
        this.currentQuestion.answers[index].chosen = false;
      }
    }
    // this.selectedAnswers.forEach(element => {
    //   this.currentQuestion.answers[element].chosen=true;
    // });
    let correct: boolean = true;
    this.currentQuestion.answers.forEach((element) => {
      if (element.correct != element.chosen) correct = false;
    });
    this.currentQuestion.correct = correct;

    this.qHandler.handleValidation();
  }
}
