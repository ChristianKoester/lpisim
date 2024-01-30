import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionApiService {
  private baseUrl = 'api';

  constructor(private httpClient: HttpClient) {}

  getQuestions(collection: string): Observable<Question[]> {
    return this.httpClient.get<Question[]>(`${this.baseUrl}/${collection}`);
  }

  getQuestion(collection: string, id: number): Observable<Question> {
    return this.httpClient.get<Question>(`${this.baseUrl}/${collection}/${id}`)
  }
}
