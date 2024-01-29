import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { QuizHandlingService } from '../quiz-handling.service';

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

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
  ) {}
  
  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'multi') {
        this.question = question;
        const answeredIndex = this.quizHandler.answerdQuestions.findIndex(val => val.qid === question.id);
        this.selectedAnswers = [];
        this.quizHandler.answerdQuestions[answeredIndex]?.answers.map((answer => this.selectedAnswers.push(+answer)));
      }
    });
    this.subValidaton = this.quizHandler.startValidation$.subscribe((type) => {
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

    this.quizHandler.addToAnswers(this.selectedAnswers.map(value => value.toString()), valid);
    this.quizHandler.handleValidation(valid);
  }
}
