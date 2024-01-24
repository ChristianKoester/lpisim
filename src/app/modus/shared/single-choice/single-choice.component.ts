import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';

@Component({
  selector: 'lpi-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrl: './single-choice.component.css'
})
export class SingleChoiceComponent implements OnChanges {
  @Input() question: Question;
  @Output() onValidationComplete = new EventEmitter<string>();
  selectedAnswer: number;

  ngOnChanges(): void {
    this.selectedAnswer = null;
  }

  validateForm() {
    this.onValidationComplete.emit(
      this.selectedAnswer !== null && this.question.choices[this.selectedAnswer].correct ? 'OK' : 'Kacke'
    );
  }
}
