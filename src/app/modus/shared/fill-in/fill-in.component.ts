import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { ModusHandlingService } from '../modus-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-fill-in',
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.css',
})
export class FillInComponent implements OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  question: Question;
  givenAnswer: string = '';

  constructor(private modusHandler: ModusHandlingService) {
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      if (question.type === 'fill') {
        console.log('fill / id: ' + question.id);
        this.question = question;
        this.givenAnswer = '';
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

    console.log('validator: fill; question: ' + this.question.id);
    console.log(this.question);
    console.log(this.givenAnswer);
    console.log(this.modusHandler.valid);

    this.modusHandler.validationComplete();
  }
}
