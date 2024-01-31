import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lpi-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrl: './multi-choice.component.css',
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  currentQuestion: Question;
  selectedAnswers: number[] = [];

  constructor(
    private qHandler: QuestionHandlingService,
  ) {}
  
  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'multi') {
        this.currentQuestion = question;
        this.selectedAnswers = [];  // WARUM NOTWENDIG ???
        for (let index = 0; index < question.answers.length; index++) {
          if (question.answers[index].chosen) 
            this.selectedAnswers.push(index);
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
    this.selectedAnswers.forEach(element => {
      this.currentQuestion.answers[element].chosen=true;
    });
    let correct: boolean = true;
    this.currentQuestion.answers.forEach(element => {
      if (element.correct !== element.correct)
        correct = false;
    });
    this.currentQuestion.correct = correct;

    this.qHandler.handleValidation(true);
  }
}
