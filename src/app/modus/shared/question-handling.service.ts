import { Injectable } from '@angular/core';
import { QuestionApiService } from '../../shared/question-api.service';
import { Question } from '../../shared/question.model';
import { ReplaySubject } from 'rxjs';
import { OptionsService } from '../../shared/options.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionHandlingService {
  private _question$: ReplaySubject<Question> = new ReplaySubject<Question>(1);
  question$ = this._question$.asObservable();

  questions: Question[];
  currentQuestion: Question;
  currentIndex: number;

  constructor(
    private qServ: QuestionApiService,
    private optionsServ: OptionsService
  ) {}

  loadQuestions(collection: string, modus: string) {
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

  nextQuestion(id?: number) {
    if (typeof id === 'undefined') {
      id =
        this.currentIndex < this.questions.length - 1
          ? ++this.currentIndex
          : this.currentIndex;
    }
    this.currentQuestion = this.questions[this.currentIndex];
    this._question$.next(this.currentQuestion);
  }

  previousQuestion(id?: number) {
    if (typeof id === 'undefined') {
      id = this.currentIndex > 0 ? --this.currentIndex : this.currentIndex;
    }
    this.currentQuestion = this.questions[this.currentIndex];
    this._question$.next(this.currentQuestion);
  }

  specificQuestion(id: number) {
    const index = this.questions.findIndex((val) => val.id === id);
    this.currentQuestion = this.questions[index];
    this.currentIndex = index;
    this._question$.next(this.currentQuestion);
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
}
