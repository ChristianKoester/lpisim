import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Question } from '../../../shared/question.model';

@Component({
  selector: 'lpi-fill-in',
  templateUrl: './fill-in.component.html',
  styleUrl: './fill-in.component.css'
})
export class FillInComponent implements OnChanges {
  @Input() question: Question;
  @Output() onValidationComplete = new EventEmitter<string>();
  givenAnswer: string = '';

  ngOnChanges(): void {
    this.givenAnswer = '';
  }

  validateForm() {
    this.onValidationComplete.emit(
      this.givenAnswer === this.question.choices[0].answer ? 'OK' : 'Kacke'
    );
  }
}
