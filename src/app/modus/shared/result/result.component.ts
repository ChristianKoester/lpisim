import { Component, OnInit } from '@angular/core';
import { QuestionHandlingService } from '../question-handling.service';
import { Question } from '../../../shared/question.model';

@Component({
  selector: 'lpi-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  data: any;
  options: any;

  showAnswers: boolean = false;
  questions: Question[];

  correctQuestions: number = 0;
  wrongQuestions: number = 0;
  skippedQuestions: number = 0;
  uneditedQuestions: number = 0;

  modus: string;

  constructor(private qHandler: QuestionHandlingService) {}

  ngOnInit(): void {
    this.modus = this.qHandler.getModus();
    this.questions = this.qHandler.getAllQuestions()
    this.correctQuestions = 0;
    this.wrongQuestions = 0;
    this.skippedQuestions = 0;
    this.uneditedQuestions = this.qHandler.totalQuestions;
    this.questions?.forEach(q => {
      if (q.answered) {
        this.uneditedQuestions--;
        if (q.correct) {
          this.correctQuestions++;
        } else {
          this.wrongQuestions++;
        }
      }
      if (q.skipped) {
        this.skippedQuestions++;
      }
    })
    this.wrongQuestions = Math.max(this.wrongQuestions, this.qHandler.totalWrongQuestions);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Korrekt', 'Übersprungen', 'Falsch', 'Unbearbeitet'],
      datasets: [
        {
          data: [this.correctQuestions, this.skippedQuestions, this.wrongQuestions, this.uneditedQuestions],
          backgroundColor: [
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--gray-300'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--gray-200'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  getStatus(index: number):number {
    const cq = this.qHandler.getQuestion(index);
    
    // 1 = skipped
    if (!cq.answered && cq.skipped) {
      return 1
    }

    // 3 = correct
    if (cq.answered && cq.correct) {
      return 3
    }

    // 4 = wrong
    if (cq.answered && !cq.correct) {
      return 4
    }

    // 5 = unedited
    return 5;
  }
}
