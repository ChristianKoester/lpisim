import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Observable, catchError, delay, map, retryWhen, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private httpClient: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.httpClient.get<Question[]>('api/questions').pipe(
      tap(response =>  {console.log(response) }),
      map(response => { 
        console.log("res " + response.length)
        if (response.length === 0) {
          throw new Error()
        }
        return response;
      }),
      retryWhen (errors => errors.pipe(take(2), delay(300)))
    )
  }

  getQuestion(id: number): Observable<Question> {
    console.log('getSingle');
    return this.httpClient.get<Question>(`api/questions?qid=67&catalogue=lpic101`).pipe(
      tap(response =>  {console.log(response) }),
      map(response => { 
        console.log("res " + response)
        if (response === null) {
          throw new Error()
        }
        return response;
      }),
      retryWhen (errors => errors.pipe(take(2), delay(1000)))
    )
  }

}
