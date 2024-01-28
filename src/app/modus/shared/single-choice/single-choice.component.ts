import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { ModusHandlingService } from '../modus-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrl: './single-choice.component.css',
})
export class SingleChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidation: Subscription;
  question: Question;
  selectedAnswer: number;

  constructor(private modusHandler: ModusHandlingService) {}
  
  ngOnInit(): void {
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      if (question.type === 'single') {
        this.question = question;
        const answeredIndex = this.modusHandler.selectedAnswers.findIndex(val => val.qid === question.id);
        this.selectedAnswer = answeredIndex !== -1 ? +this.modusHandler.selectedAnswers[answeredIndex].answers[0] : null;
      }
    });
    this.subValidation = this.modusHandler.startValidation$.subscribe((type) => {
      if (type === 'single') this.validateAnswer();
    });   
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidation.unsubscribe();
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
