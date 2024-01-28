import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { ModusHandlingService } from '../modus-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-fill-in',
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.css',
})
export class FillInComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  question: Question;
  givenAnswer: string = '';

  constructor(private modusHandler: ModusHandlingService) {}
  
  ngOnInit(): void {
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      if (question.type === 'fill') {
        this.question = question;
        const answeredIndex = this.modusHandler.selectedAnswers.findIndex(val => val.qid === question.id);
        this.givenAnswer = '';
        if (answeredIndex !== -1)
          this.givenAnswer += this.modusHandler.selectedAnswers[answeredIndex].answers[0];
      }
    });
    this.subValidaton = this.modusHandler.startValidation$.subscribe((type) => {
      if (type === 'fill') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    if (this.givenAnswer === this.question.choices[0].answer) {
      this.modusHandler.valid = true;
    } else {
      this.modusHandler.valid = false;
    }

    this.modusHandler.addToAnswers([this.givenAnswer]);
    this.modusHandler.validationComplete();
  }
}
