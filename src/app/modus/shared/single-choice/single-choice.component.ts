import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { QuizHandlingService } from '../quiz-handling.service';

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

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
  ) {}
  
  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'single') {
        this.question = question;
        const answeredIndex = this.quizHandler.answerdQuestions.findIndex(val => val.qid === question.id);
        this.selectedAnswer = answeredIndex !== -1 ? +this.quizHandler.answerdQuestions[answeredIndex].answers[0] : null;
      }
    });
    this.subValidation = this.quizHandler.startValidation$.subscribe((type) => {
      if (type === 'single') this.validateAnswer();
    });   
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidation.unsubscribe();
  }

  validateAnswer() {
    const valid = 
      this.selectedAnswer !== null &&
      !Number.isNaN(this.selectedAnswer) &&
      this.question.choices[this.selectedAnswer].correct

    this.quizHandler.addToAnswers([this.selectedAnswer?.toString()], valid);
    this.quizHandler.handleValidation(valid);
  }
}
