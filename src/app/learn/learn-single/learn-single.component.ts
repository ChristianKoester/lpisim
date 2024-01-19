import { Component } from '@angular/core';
import { Question } from '../../shared/question.model';
import { QuestionService } from '../../shared/question.service';

@Component({
  selector: 'lpi-learn-single',
  templateUrl: './learn-single.component.html',
  styleUrl: './learn-single.component.css'
})
export class LearnSingleComponent {
  question: Question;

  constructor(private qServ: QuestionService) {}

  ngOnInit(): void {
  }
  
  getQuestion() {
    this.qServ.getQuestion(1).subscribe(
      (data) => {
        this.question = data[0];
      }
    );
  }
}
