import { Component, OnDestroy } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { ModusHandlingService } from '../modus-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrl: './single-choice.component.css',
})
export class SingleChoiceComponent implements OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  question: Question;
  selectedAnswer: number;

  constructor(private modusHandler: ModusHandlingService) {
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      if (question.type === 'single') {
        this.question = question;
        // TODO: Falls Frage schon beantwortet an dieser Stelle setzen ?!
        this.selectedAnswer = null;
      }
    });
    this.subValidaton = this.modusHandler.startValidation$.subscribe((type) => {
      if (type === 'single') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    if (
      this.selectedAnswer !== null &&
      this.question.choices[this.selectedAnswer].correct
    ) {
      this.modusHandler.valid = true;
    } else {
      this.modusHandler.valid = false;
    }

    this.modusHandler.addToAnswers([this.selectedAnswer?.toString()]);
    this.modusHandler.validationComplete();
  }
}
