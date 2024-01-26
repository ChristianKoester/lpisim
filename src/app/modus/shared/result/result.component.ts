import { Component, OnInit } from '@angular/core';
import { ModusHandlingService } from '../modus-handling.service';

@Component({
  selector: 'lpi-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  correctAnswers: number = 0;
  falseAnswers: number = 0;
  skippedAnswers: number = 0;

  constructor(private modusHandler: ModusHandlingService) {}

  ngOnInit(): void {
    this.skippedAnswers = this.modusHandler.skippedQuestions.length;
    this.correctAnswers = this.modusHandler.selectedAnswers.filter(val => val.correct).length;
    this.falseAnswers = this.modusHandler.selectedAnswers.filter(val => !val.correct).length;
  }
}
