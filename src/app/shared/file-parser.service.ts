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

  // async getQuestions(collection: string): Promise<Question[]> {
  //   const lines: string[] = [];
  //   let questions: Question[] = []

  //   async function fetchQuestions() {
  //     const response = await fetch('/assets/' + collection);
  //     const questions = await response.text();
  //   return questions;
  //   }
    
  //   return new Promise((resolve, reject) => {
  //     fetchQuestions()
  //     .then((data) => {
  //       for (const line of data.split(/[\r\n]+/)) {
  //         if (line.length !== 0) {
  //           lines.push(line);
  //         }
  //       }
  //       questions = this.extractData(collection, lines);
  //       resolve(questions);
  //     });
  //   })
  // }


  private extractData(collection: string, data: string[]): Question[] {
    let questions: Question[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith('QUESTION')) {
        // Extract ID
        const id = +data[i].match('[0-9]+');

        // Extract Question
        let question = '';
        i++;
        while (!data[i].startsWith('A. ') && !data[i].startsWith('Answer:')) {
          question += data[i] + '\n\r';
          i++;
        }

        // Extract Options
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

        // Extract Answer
        let solution = '';
        if (data[i].startsWith('Answer:')) {
          solution = data[i].substring(8);
        }

        // Find out type and mark correct answers
        let type = 'single';
        if (!choices.length) {
          type = 'fill';
          choices.push({ answer: solution, correct: true });
        } else {
          if (solution.length > 1) {
            type = 'multi';
          }
          for (let char of solution) {
            switch (char) {
              case 'A':
                choices[0].correct = true;
                break;
              case 'B':
                choices[1].correct = true;
                break;
              case 'C':
                choices[2].correct = true;
                break;
              case 'D':
                choices[3].correct = true;
                break;
              case 'E':
                choices[4].correct = true;
                break;
            }
          }
        }

        // console.log('id: ' + id);
        // console.log('catalogue: ' + catalogue);
        // console.log('type: ' + type);
        // console.log('question: ' + question);
        // console.log('options: ' + choices);
        // // console.log('answer: ' + solution);
        // console.log('---');

        const q: Question = {
          id: id,
          collection: collection,
          type: type,
          question: question,
          choices: choices,
        };

        questions.push(q);
      }
    }
    return questions;
  }
}
