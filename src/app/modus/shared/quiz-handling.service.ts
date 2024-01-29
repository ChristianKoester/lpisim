import { Injectable } from '@angular/core';
import { QuestionHandlingService } from './question-handling.service';
import { Router } from '@angular/router';
import { Subject, skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizHandlingService {
  private quizType = '';

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
  private wrongAnswersCount: number = 0;
  // valid: boolean;


  constructor(
    private qHandler: QuestionHandlingService,
    private router: Router,
  ) {}


  initQuiz(type: string) {
    this.quizType = type;
    this.skippedQuestions = [];
    this.answerdQuestions = [];
    this.wrongAnswersCount = 0;
  }

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

  addToAnswers(answers: string[], valid?: boolean) {
    const existIndex = this.answerdQuestions.findIndex(
      (val) => val.qid === this.qHandler.currentQuestion.id
    );
    if (existIndex === -1) {
      this.answerdQuestions.push({
        qid: this.qHandler.currentQuestion.id,
        correct: valid,
        answers: answers,
      });
    } else {
      this.answerdQuestions[existIndex] = {
        qid: this.qHandler.currentQuestion.id,
        correct: valid,
        answers: answers,
      };
    }
  }

  validate() {
    this._startValidation$.next(this.qHandler.currentQuestion.type);
  }

  handleValidation(valid: boolean) {
    if (!valid) 
      this.wrongAnswersCount++;
    switch (this.quizType) {
      case 'exam': 
        console.log('start examHandler');
        this.handleExamValidation();
        break;
      case 'check':
        console.log('start checkHandler');
        this.handleCheckValidation(valid);
        break;
       }     
  }

  handleExamValidation() {
    const questionsCount = this.qHandler.questions.length;
    const falseAnswers = this.answerdQuestions.filter(
      (val) => !val.correct
    ).length;
    if (
      falseAnswers >= questionsCount * 0.2 ||
      this.qHandler.currentIndex === questionsCount - 1
    ) {
      this.router.navigateByUrl(`/${this.quizType}/result`);
    } else {
      this.qHandler.nextQuestion();
    }
  }

  handleCheckValidation(valid?: boolean) {
    const questionsCount = this.qHandler.questions.length;
    if (
      this.wrongAnswersCount >= 7 ||
      this.qHandler.currentIndex === questionsCount - 1
    ) {
      this.router.navigateByUrl(`/${this.quizType}/result`);
    } else if (valid) {
      this.qHandler.nextQuestion();
    } else {
      this.qHandler.previousQuestion();
    }
  }
}
