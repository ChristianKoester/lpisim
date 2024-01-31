import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { QuestionHandlingService } from './question-handling.service';
// import { AnsweredQuestion, Question } from '../../shared/question.model';
// import { ErrorMsg } from './error-msg.model';

@Injectable({
  providedIn: 'root',
})
export class QuizHandlingService {
  // private quizType = '';

  // private _startValidation$: Subject<string> = new Subject<string>();
  // startValidation$ = this._startValidation$.asObservable();

  // private _skipped$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
  // skipped$ = this._skipped$.asObservable();

  // private _errorMsg$: Subject<ErrorMsg> = new Subject<ErrorMsg>();
  // errorMsg$ = this._errorMsg$.asObservable();

  // answerdQuestions: AnsweredQuestion[] = [];

  // private skippedQuestions: Question[] = [];
  // private wrongAnswersCount: number = 0;


  // constructor(
  //   private qHandler: QuestionHandlingService,
  // ) {}


  // initQuiz(type: string) {
  //   this.quizType = type;
  //   this.wrongAnswersCount = 0;
  //   this.answerdQuestions = [];
  //   this.skippedQuestions = [];
  //   this._skipped$.next(this.skippedQuestions);
  // }

  // addToSkip(question: Question) {
  //   const existIndex = this.skippedQuestions.indexOf(question);
  //   if (existIndex === -1) {
  //     this.skippedQuestions.push(question);
  //   } else {
  //     this.skippedQuestions[existIndex] = question;
  //   }
  //   console.log(this.skippedQuestions);
  //   this._skipped$.next(this.skippedQuestions);
  // }

  // private removeFromSkip() {
  //   this.skippedQuestions = this.skippedQuestions.filter(
  //     val => val != this.qHandler.currentQuestion
  //   )
  //   this._skipped$.next(this.skippedQuestions);
  // }

  // addToAnswers(answers: string[], valid: boolean) {
  //   const existIndex = this.answerdQuestions.findIndex(
  //     (val) => val.question.id === this.qHandler.currentQuestion.id
  //   );
  //   if (existIndex === -1) {
  //     this.answerdQuestions.push({
  //       question: this.qHandler.currentQuestion,
  //       correct: valid,
  //       answers: answers,
  //     });
  //   } else {
  //     this.answerdQuestions[existIndex] = {
  //       question: this.qHandler.currentQuestion,
  //       correct: valid,
  //       answers: answers,
  //     };
  //   }
  // }

  // validate() {
  //   if (this.skippedQuestions.includes(this.qHandler.currentQuestion)) {
  //     this.removeFromSkip();
  //   }
  //   this._startValidation$.next(this.qHandler.currentQuestion.type);
  // }

  // handleValidation(valid: boolean) {
  //   if (!valid) 
  //     this.wrongAnswersCount++;
  //   switch (this.quizType) {
  //     case 'exam': 
  //       this.handleExamValidation();
  //       break;
  //     case 'check':
  //       this.handleCheckValidation(valid);
  //       break;
  //      }     
  // }

  // handleExamValidation() {
  //   const questionsCount = this.qHandler.questions.length;
  //   // const falseAnswers = this.answerdQuestions.filter(
  //   //   (val) => !val.correct
  //   // ).length;
  //   const falseAnswers = 0;
  //   if (
  //     falseAnswers >= questionsCount * 0.2 ||
  //     this.qHandler.currentIndex === questionsCount - 1
  //   ) {
  //     this._errorMsg$.next({
  //       'header': 'Zuviele falsche Antworten',
  //       'body': 'Du sollst nicht raten! Benutze den Learn-Modus!',
  //       'critical': true
  //     });
  //   } else {
  //     this.qHandler.nextQuestion();
  //   }
  // }

  // handleCheckValidation(valid: boolean) {
  //   const questionsCount = this.qHandler.questions.length;
  //   if (
  //     this.wrongAnswersCount >= 7 ||
  //     this.qHandler.currentIndex === questionsCount - 1
  //   ) {
  //     this._errorMsg$.next({
  //       'header': 'Zuviele falsche Antworten',
  //       'body': 'Du sollst nicht raten! Benutze den Learn-Modus!',
  //       'critical': true
  //     });
  //   } else if (valid) {
  //     this.qHandler.nextQuestion();
  //   } else {
  //     this._errorMsg$.next({
  //       'header': 'Ups...',
  //       'body': 'Das war leider so nicht korrekt. Du bist kacke!',
  //       'critical': false
  //     });
  //     this.qHandler.previousQuestion();
  //   }
  // }
}
