import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorMsg } from './error-msg.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  private _errorMsg$: Subject<ErrorMsg> = new Subject<ErrorMsg>();
  errorMsg$ = this._errorMsg$.asObservable();

  constructor() { }

  tooManyWrongAnswers() {
    this._errorMsg$.next({
      header: 'Zuviele falsche Antworten',
      body: 'Du sollst nicht raten! Benutze den Learn-Modus!',
      critical: true,
    });
  }

  wrongAnswer() {
    this._errorMsg$.next({
      header: 'Falsche Antwort',
      body: 'Das war leider so nicht korrekt. Du wirst eine Frage zurückgesetzt!',
      critical: false,
    });
  }

  noAnswer() {
    this._errorMsg$.next({
      header: 'Ups...',
      body: 'Du hast vergessen eine Antwort zu geben!',
      critical: false,
    });
  }
}
