import { Injectable } from '@angular/core';
import { QuestionService } from '../../shared/question.service';
import { Question } from '../../shared/question.model';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModusHandlingService {
  private _question$: ReplaySubject<Question> = new ReplaySubject<Question>(1);
  question$ = this._question$.asObservable();

  private _startValidation$: Subject<string> = new Subject<string>();
  startValidation$ = this._startValidation$.asObservable();

  private _validationComplete$: Subject<boolean> = new Subject<boolean>();
  validationComplete$ = this._validationComplete$.asObservable();

  questions: Question[];
  currentQuestion: Question;
  currentID: number;
  valid: boolean;

  constructor(private qServ: QuestionService) {}

  loadQuestions(collection: string) {
    this.qServ.getQuestions(collection).subscribe((questions) => {
      this.questions = questions;
      this.currentID = 1;
      this.currentQuestion = this.questions.find(
        (value) => value.id === this.currentID
      );
      this._question$.next(this.currentQuestion);
    });
  }

  nextQuestion() {
    if (this.currentID < this.questions.length)
      this.currentID++;
    this.currentQuestion = this.questions.find(
      (value) => value.id === this.currentID
    );
    this._question$.next(this.currentQuestion);
  }

  previousQuestion() {
    if (this.currentID > 1)
      this.currentID--;
    this.currentQuestion = this.questions.find(
      (value) => value.id === this.currentID
    );
    this._question$.next(this.currentQuestion);
  }

  validate() {
    this._startValidation$.next(this.currentQuestion.type);
  }

  validationComplete() {
    this._validationComplete$.next(true);
  }
}
