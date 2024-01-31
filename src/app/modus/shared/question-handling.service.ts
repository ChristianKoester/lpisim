import { Injectable, OnInit } from '@angular/core';
import { QuestionApiService } from '../../shared/question-api.service';
import { Question } from '../../shared/question.model';
import { ReplaySubject, Subject } from 'rxjs';
import { OptionsService } from '../../shared/options.service';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionHandlingService implements OnInit {
  private _question$: ReplaySubject<Question> = new ReplaySubject<Question>(1);
  question$ = this._question$.asObservable();

  private _startValidation$: Subject<string> = new Subject<string>();
  startValidation$ = this._startValidation$.asObservable();

  private modus = '';
  private questions: Question[];
  currentQuestion: Question;
  currentIndex: number;

  // Refactor!
  totalWrongQuestions: number = 0;
  totalQuestions: number = 0;

  constructor(
    private qServ: QuestionApiService,
    private optionsServ: OptionsService,
    private errorMsgServ: ErrorMessageService
  ) {}

  ngOnInit(): void {
    
  }

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
        this.questions = this.questions.slice(0, questionCount);
      }

      this.totalWrongQuestions = 0;
      this.totalQuestions = this.questions.length;
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

  handleValidation() {
    this.currentQuestion.answered = true;
    if (this.currentQuestion.skipped) this.currentQuestion.skipped = false;
    if (!this.currentQuestion.correct) {
      this.totalWrongQuestions++;
    }
    if (this.modus === 'exam') {
      this.examValidation();
    } else {
      this.checkValidation();
    }
  }

  private examValidation() {
    if (
      this.totalWrongQuestions >= this.totalQuestions * 0.2 ||
      this.currentIndex === this.totalQuestions - 1 // WHY ???
    ) {
      this.errorMsgServ.tooManyWrongAnswers();
    } else {
      this.nextQuestion();
    }
  }

  private checkValidation() {
    if (
      this.totalWrongQuestions >= 7 ||
      this.currentIndex === this.totalQuestions - 1 // WHY ???
    ) {
      this.errorMsgServ.tooManyWrongAnswers();
    } else if (this.currentQuestion.correct) {
      this.nextQuestion();
    } else {
      this.errorMsgServ.wrongAnswer();
      this.previousQuestion();
    }
  }
}
