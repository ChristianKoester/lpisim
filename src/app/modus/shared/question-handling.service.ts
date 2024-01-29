import { Injectable } from '@angular/core';
import { QuestionService } from '../../shared/question.service';
import { Question } from '../../shared/question.model';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionHandlingService {
  private _question$: ReplaySubject<Question> = new ReplaySubject<Question>(1);
  question$ = this._question$.asObservable();

  questions: Question[];
  currentQuestion: Question;
  currentIndex: number;

  constructor(private qServ: QuestionService) {}

  loadQuestions(collection: string, shuffle: boolean, questionCount?: number) {
    this.qServ.getQuestions(collection).subscribe((questions) => {
      this.questions = questions;
      if (shuffle) {
        this.shuffleQuestions();
      }
      if (typeof questionCount !== 'undefined') {
        if (questionCount < questions.length) {
          this.questions = questions.slice(0, questionCount);
        }
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
    const index = this.questions.findIndex(val => val.id === id);
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
