import { Component, OnInit } from '@angular/core';
import { QuizHandlingService } from '../quiz-handling.service';
import { AnsweredQuestion } from '../../../shared/question.model';

@Component({
  selector: 'lpi-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  data: any;
  options: any;

  showAnswers: boolean = false;
  answeredQuestions: AnsweredQuestion[];

  correctAnswers: number = 0;
  falseAnswers: number = 0;
  skippedAnswers: number = 0;
  untouchedQuestions: number = 0.0001;

  constructor(
    private quizHandler: QuizHandlingService,
  ) {}

  ngOnInit(): void {
    this.answeredQuestions =this.quizHandler.answerdQuestions;

    this.quizHandler.skipped$.subscribe(
      (skipped => this.skippedAnswers = skipped.length)
    ).unsubscribe();
    this.correctAnswers = this.quizHandler.answerdQuestions.reduce(
      (acc, val) => (val.correct ? acc + 1 : acc), 0 
    );
    this.falseAnswers = this.quizHandler.answerdQuestions.reduce(
      (acc, val) => (!val.correct ? acc + 1 : acc ), 0
    )

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Korrekt', 'Übersprungen', 'Falsch'],
      datasets: [
        {
          data: [this.correctAnswers, this.skippedAnswers, this.falseAnswers, this.untouchedQuestions],
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
}
