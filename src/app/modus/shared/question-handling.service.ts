import { Injectable } from '@angular/core';
import { QuestionApiService } from '../../shared/question-api.service';
import { Question } from '../../shared/question.model';
import { ReplaySubject, Subject } from 'rxjs';
import { OptionsService } from '../../shared/options.service';
import { ErrorMsg } from './error-msg.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionHandlingService {
  private _question$: ReplaySubject<Question> = new ReplaySubject<Question>(1);
  question$ = this._question$.asObservable();

  private _startValidation$: Subject<string> = new Subject<string>();
  startValidation$ = this._startValidation$.asObservable();

  private _errorMsg$: Subject<ErrorMsg> = new Subject<ErrorMsg>();
  errorMsg$ = this._errorMsg$.asObservable();

  private modus = '';
  private questions: Question[];
  currentQuestion: Question;
  currentIndex: number;

  // Refactor!
  private wrongAnswersCount: number = 0;

  constructor(
    private qServ: QuestionApiService,
    private optionsServ: OptionsService
  ) {}

  loadQuestions(collection: string, modus: string) {
    this.modus = modus;
    const shuffle =
      modus === 'check'
        ? this.optionsServ.options.shuffleCheck
        : this.optionsServ.options.shuffleExam;

    const questionCount =
      modus === 'check'
        ? this.optionsServ.options.qMaxCheck
        : this.optionsServ.options.qMaxExam;

    this.qServ.getQuestions(collection).subscribe((questions) => {
      this.questions = questions;

      if (shuffle) {
        this.shuffleQuestions();
      }

      if (questionCount < questions.length && questionCount > 0) {
        this.questions = questions.slice(0, questionCount);
      }

      this.currentIndex = 0;
      this.currentQuestion = questions[this.currentIndex];
      this._question$.next(this.currentQuestion);
    });
  }

  private shuffleQuestions() {
    let currentIndex = this.questions.length;
    let randomIndex: number;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [this.questions[currentIndex], this.questions[randomIndex]] = [
        this.questions[randomIndex],
        this.questions[currentIndex],
      ];
    }
  }

  getAllQuestions(): Question[] {
    return this.questions;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
    this.currentQuestion = this.questions[this.currentIndex];
    this._question$.next(this.currentQuestion);
  }

  previousQuestion() {
    if (this.currentIndex > 0) this.currentIndex--;
    this.currentQuestion = this.questions[this.currentIndex];
    this._question$.next(this.currentQuestion);
  }

  specificQuestion(index: number) {
    this.currentQuestion = this.questions[index];
    this.currentIndex = index;
    this._question$.next(this.currentQuestion);
  }

  setSkip() {
    this.currentQuestion.skipped = true;
  }

  validateQuestion() {
    this._startValidation$.next(this.currentQuestion.type);
  }

  handleValidation(valid: boolean) {
    if (!valid) this.wrongAnswersCount++;
    switch (this.modus) {
      case 'exam':
        this.handleExamValidation();
        break;
      case 'check':
        this.handleCheckValidation(valid);
        break;
    }
  }

  private handleExamValidation() {
    const questionsCount = this.questions.length;
    // const falseAnswers = this.answerdQuestions.filter(
    //   (val) => !val.correct
    // ).length;
    const falseAnswers = 0;
    if (
      falseAnswers >= questionsCount * 0.2 ||
      this.currentIndex === questionsCount - 1
    ) {
      this._errorMsg$.next({
        header: 'Zuviele falsche Antworten',
        body: 'Du sollst nicht raten! Benutze den Learn-Modus!',
        critical: true,
      });
    } else {
      this.nextQuestion();
    }
  }

  private handleCheckValidation(valid: boolean) {
    const questionsCount = this.questions.length;
    if (
      this.wrongAnswersCount >= 7 ||
      this.currentIndex === questionsCount - 1
    ) {
      this._errorMsg$.next({
        header: 'Zuviele falsche Antworten',
        body: 'Du sollst nicht raten! Benutze den Learn-Modus!',
        critical: true,
      });
    } else if (valid) {
      this.nextQuestion();
    } else {
      this._errorMsg$.next({
        header: 'Ups...',
        body: 'Das war leider so nicht korrekt. Du bist kacke!',
        critical: false,
      });
      this.previousQuestion();
    }
  }
}
