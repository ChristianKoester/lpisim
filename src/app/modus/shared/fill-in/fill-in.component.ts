import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { QuizHandlingService } from '../quiz-handling.service';

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

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
  ) {}
  
  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'fill') {
        this.question = question;
        const answeredIndex = this.quizHandler.answerdQuestions.findIndex(val => val.question.id === question.id);
        this.givenAnswer = '';
        if (answeredIndex !== -1)
          this.givenAnswer += this.quizHandler.answerdQuestions[answeredIndex].answers[0];
      }
    });
    this.subValidaton = this.quizHandler.startValidation$.subscribe((type) => {
      if (type === 'fill') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    const valid = this.givenAnswer === this.question.choices[0].answer

    this.quizHandler.addToAnswers([this.givenAnswer], valid);
    this.quizHandler.handleValidation(valid);
  }
}
