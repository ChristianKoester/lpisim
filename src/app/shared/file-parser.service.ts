import { Injectable } from '@angular/core';
import { Question } from './question.model';

@Injectable({
  providedIn: 'root',
})
export class FileParserService {
  private questions: Question[] = [];

  constructor() {}
  
  getQuestions(): Question[] {
    this.parse('lpic101');
    this.parse('lpic102');
    return this.questions;
  }

  private parse(fileName: string) {
    let lines: string[] = [];
    fetch('/assets/' + fileName)
      .then((response) => response.text())
      .then((data) => {
        for (const line of data.split(/[\r\n]+/)) {
          if (line.length !== 0) {
            lines.push(line);
          }
        }
        this.extractData(fileName, lines);
      });
  }

  private extractData(catalogue: string, data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith('QUESTION')) {
        // Extract ID
        const id = +data[i].match('[0-9]+');

        // Extract Question
        let question = '';
        i++;
        while (
          !data[i].startsWith('A. ') &&
          !data[i].startsWith('Answer:')
        ) {
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
          qid: id,
          catalogue: catalogue,
          type: type,
          question: question,
          choices: choices,
        };

        this.questions.push(q);
      }
    }
  }
}
