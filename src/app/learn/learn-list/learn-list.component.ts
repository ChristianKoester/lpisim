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
    this.qServ.getQuestions().subscribe(
      (data) => {
        this.questions = data;
      }
    );
    // this.questions = this.mockQuestions();
  }

  // private mockQuestions(): Question[] {
  //   const q: Question = {
  //     id: 1,
  //     catalogue: 'mock101',
  //     type: 'single',
  //     question: `Which type of file system is created by mkfs when it is executed with the block device name only and
  //     without any additional parameters?`,
  //     choices: [
  //       {answer: 'XFS', correct: true},
  //       {answer: 'VFAT', correct: false},
  //       {answer: 'ext2', correct: true},
  //       {answer: 'ext3', correct: false},
  //       {answer: 'ext4', correct: false},
  //     ]
  //   };
  //   return [q,q,q];
  // }
}
