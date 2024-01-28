import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { ModusHandlingService } from '../modus-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrl: './multi-choice.component.css',
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  question: Question;
  selectedAnswers: number[] = [];

  constructor(private modusHandler: ModusHandlingService) {}
  
  ngOnInit(): void {
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      if (question.type === 'multi') {
        this.question = question;
        const answeredIndex = this.modusHandler.selectedAnswers.findIndex(val => val.qid === question.id);
        this.selectedAnswers = [];
        this.modusHandler.selectedAnswers[answeredIndex]?.answers.map((answer => this.selectedAnswers.push(+answer)));
      }
    });
    this.subValidaton = this.modusHandler.startValidation$.subscribe((type) => {
      if (type === 'multi') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    let valid: boolean = true;
    for (let i = 0; i < this.question.choices.length; i++) {
      if (this.question.choices[i].correct) {
        if (!this.selectedAnswers.includes(i)) valid = false;
      } else {
        if (this.selectedAnswers.includes(i)) valid = false;
      }
    }

    if (valid) {
      this.modusHandler.valid = true;
    } else {
      this.modusHandler.valid = false;
    }
    this.modusHandler.addToAnswers(this.selectedAnswers.map(value => value.toString()));
    this.modusHandler.validationComplete();
  }
}
