import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { QuestionHandlingService } from './question-handling.service';
import { Question } from '../../shared/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuizHandlingService {
  private quizType = '';

  private _startValidation$: Subject<string> = new Subject<string>();
  startValidation$ = this._startValidation$.asObservable();

  private _skipped$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  skipped$ = this._skipped$.asObservable();

  answerdQuestions: {
    qid: number;
    correct: boolean;
    answers: string[];
  }[] = [];

  private skippedQuestions: Question[] = [];
  private wrongAnswersCount: number = 0;


  constructor(
    private qHandler: QuestionHandlingService,
    private router: Router,
  ) {}


  initQuiz(type: string) {
    this.quizType = type;
    this.wrongAnswersCount = 0;
    this.answerdQuestions = [];
    this.skippedQuestions = [];
    this._skipped$.next(this.skippedQuestions);
  }

  addToSkip(question: Question) {
    const existIndex = this.skippedQuestions.indexOf(question);
    if (existIndex === -1) {
      this.skippedQuestions.push(question);
    } else {
      this.skippedQuestions[existIndex] = question;
    }
    console.log(this.skippedQuestions);
    this._skipped$.next(this.skippedQuestions);
  }

  private removeFromSkip() {
    this.skippedQuestions = this.skippedQuestions.filter(
      val => val != this.qHandler.currentQuestion
    )
    this._skipped$.next(this.skippedQuestions);
  }

  addToAnswers(answers: string[], valid: boolean) {
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
    if (this.skippedQuestions.includes(this.qHandler.currentQuestion)) {
      this.removeFromSkip();
    }
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
