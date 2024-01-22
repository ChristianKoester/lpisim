import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../shared/question.service';
import { Question } from '../../shared/question.model';

@Component({
  selector: 'lpi-learn-list',
  templateUrl: './learn-list.component.html',
  styleUrl: './learn-list.component.css'
})
export class LearnListComponent implements OnInit {
  questions: Question[];

  constructor(private qServ: QuestionService) {}

  ngOnInit(): void {
    this.qServ.getQuestions('lpic101').subscribe(
      (data) => {
        this.questions = data;
      }
    );
  }
}
