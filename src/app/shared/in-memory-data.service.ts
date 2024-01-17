import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  questions: Question[] = []

  q: Question = {
    id: 1,
    catalogue: 'lpic1',
    type: 'single',
    question: 'question',
    answers: [
      { answer: 'answer1', correct: true },
      { answer: 'answer2', correct: false },
    ]
  }

  constructor() {
   }

  createDb() {
    const questions = [
      this.q,
      this.q,
    ]
    return { questions };
  } 
}
