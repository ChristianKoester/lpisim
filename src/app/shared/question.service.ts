import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  test() {
    console.log(this.http.get<Question[]>('api/questions'));
  }
}
