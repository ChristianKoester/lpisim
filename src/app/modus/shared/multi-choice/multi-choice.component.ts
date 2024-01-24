import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Question } from '../../../shared/question.model';

@Component({
  selector: 'lpi-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrl: './multi-choice.component.css'
})
export class MultiChoiceComponent implements OnChanges {
  @Input() question: Question;
  @Output() onValidationComplete = new EventEmitter<string>();
  selectedAnswers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedAnswers = [];  
  }

  validateForm() {
    console.log('Multi: Validation');
    let valid: boolean = true;
    for (let i = 0; i < this.question.choices.length; i++) {
      if (this.question.choices[i].correct) {
        this.selectedAnswers.includes(i) ? valid : valid = false;
      } else {
        this.selectedAnswers.includes(i) ? valid = false : valid;
      }
    }
    this.onValidationComplete.emit(
      valid ? 'OK' : 'Kacke'
    );
  }
}
