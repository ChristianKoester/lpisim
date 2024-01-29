import { Injectable } from '@angular/core';
import { QuestionHandlingService } from './question-handling.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizHandlingService {
  private _startValidation$: Subject<string> = new Subject<string>();
  startValidation$ = this._startValidation$.asObservable();

  private _validationComplete$: Subject<boolean> = new Subject<boolean>();
  validationComplete$ = this._validationComplete$.asObservable();

  answerdQuestions: {
    qid: number;
    correct: boolean;
    answers: string[];
  }[] = [];

  skippedQuestions: number[] = [];
  valid: boolean;

  constructor(
    private qHandler: QuestionHandlingService,
    private router: Router,
  ) {}


  addToSkip(): number[] {
    const existIndex = this.skippedQuestions.indexOf(this.qHandler.currentQuestion.id);
    if (existIndex === -1) {
      this.skippedQuestions.push(this.qHandler.currentQuestion.id);
    } else {
      this.skippedQuestions[existIndex] = this.qHandler.currentQuestion.id;
    }
    console.log(this.skippedQuestions);
    return this.skippedQuestions;
  }

  addToAnswers(answers: string[]) {
    const existIndex = this.answerdQuestions.findIndex(
      (val) => val.qid === this.qHandler.currentQuestion.id
    );
    if (existIndex === -1) {
      this.answerdQuestions.push({
        qid: this.qHandler.currentQuestion.id,
        correct: this.valid,
        answers: answers,
      });
    } else {
      this.answerdQuestions[existIndex] = {
        qid: this.qHandler.currentQuestion.id,
        correct: this.valid,
        answers: answers,
      };
    }
  }

  validate() {
    this._startValidation$.next(this.qHandler.currentQuestion.type);
  }

  validationComplete() {
    this.handleValidation();
    // this._validationComplete$.next(true);
  }

  handleValidation() {
    const questionsCount = this.qHandler.questions.length;
    const falseAnswers = this.answerdQuestions.filter(
      (val) => !val.correct
    ).length;
    if (
      falseAnswers >= questionsCount * 0.2 ||
      this.qHandler.currentIndex === questionsCount - 1
    ) {
      this.router.navigateByUrl('/exam/result');
    } else {
      this.qHandler.nextQuestion();
    }
  }
}
