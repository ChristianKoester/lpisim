import { Injectable } from '@angular/core';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root',
})
export class FileParserService {
  constructor() {}

  getQuestions(collection: string): Promise<Question[]> {
    const lines: string[] = [];
    
    return new Promise((resolve) => {
      fetch('/assets/' + collection)
      .then(response => response.text())
      .then((data) => {
        for (const line of data.split(/[\r\n]+/)) {
          if (line.length !== 0) {
            lines.push(line);
          }
        }
        resolve(this.extractData(collection, lines));
      });
    })
  }

  
  private extractData(collection: string, data: string[]): Question[] {
    let questions: Question[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith('QUESTION')) {
        // Extract ID
        const id = +data[i].match('[0-9]+');

        // Extract question
        let question = '';
        i++;
        while (!data[i].startsWith('A. ') && !data[i].startsWith('Answer:')) {
          question += data[i] + '\n';
          i++;
        }

        // Extract answers
        const choices: { answer: string; correct: boolean }[] = [];
        if (data[i].startsWith('A. ')) {
          do {
            choices.push({
              answer: data[i].substring(3),
              correct: false,
            });
            i++;
          } while (!data[i].startsWith('Answer:'));
        }

        // Extract Solution
        let solution = '';
        if (data[i].startsWith('Answer:')) {
          solution = data[i].substring(8);
        }

        // Find out type of question 
        let type = 'single';
        if (!choices.length) {
          type = 'fill';
          choices.push({ answer: solution, correct: true });
        } else {
          if (solution.length > 1) {
            type = 'multi';
          }
          // Mark correct answers
          for (let char of solution) {
            const pos = String.fromCharCode((char.charCodeAt(0) - 17));
            choices[pos].correct = true;
          }
        }

        // Build question object
        const q: Question = {
          id: id,
          collection: collection,
          type: type,
          question: question,
          answers: choices,
        };

        // Add question to list
        questions.push(q);
      }
    }
    return questions;
  }
}
