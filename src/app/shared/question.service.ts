import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Question } from './question.model';
import { Observable, map, retry, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService implements OnInit {

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
  }

  getQuestions(): Observable<Question[]> {
    return this.httpClient.get<Question[]>('api/questions?catalogue=lpic101').pipe(
      map((response) => {
        if (response.length === 0) {
          throw new Error();
        }
        return response;
      }),
      retry({count: 3, delay: 300})
    );
  }

  getQuestion(id: number): Observable<Question> {
    return this.httpClient
      .get<Question>(`api/questions?qid=67&catalogue=lpic101`)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        map((response) => {
          console.log('res ' + response);
          if (response === null) {
            throw new Error();
          }
          return response;
        }),
        retry({count: 3, delay: 300})
      );
  }
}

