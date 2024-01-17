import { Component } from '@angular/core';
import { QuestionService } from './shared/question.service';

@Component({
  selector: 'lpi-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(private questionService: QuestionService) {
  }

  test() {
    this.questionService.test();
  }
}
