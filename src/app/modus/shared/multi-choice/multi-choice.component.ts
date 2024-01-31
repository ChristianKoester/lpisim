import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Question } from '../../../shared/question.model';
import { QuestionHandlingService } from '../question-handling.service';
import { Subscription } from 'rxjs';
import { QuizHandlingService } from '../quiz-handling.service';

@Component({
  selector: 'lpi-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrl: './multi-choice.component.css',
})
export class MultiChoiceComponent implements OnInit, OnDestroy {
  private subQuestion: Subscription;
  private subValidaton: Subscription;
  currentQuestion: Question;
  selectedAnswers: number[] = [];

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
  ) {}
  
  ngOnInit(): void {
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      if (question.type === 'multi') {
        this.currentQuestion = question;
        // const answeredIndex = this.quizHandler.answerdQuestions.findIndex(val => val.question.id === question.id);
        // this.selectedAnswers = [];
        // this.quizHandler.answerdQuestions[answeredIndex]?.answers.map((answer => this.selectedAnswers.push(+answer)));
        this.selectedAnswers = [];  // WARUM NOTWENDIG ???
        for (let index = 0; index < question.answers.length; index++) {
          if (question.answers[index].chosen) 
            this.selectedAnswers.push(index);
        }
      }
    });
    this.subValidaton = this.qHandler.startValidation$.subscribe((type) => {
      if (type === 'multi') this.validateAnswer();
    });
  }

  ngOnDestroy(): void {
    this.subQuestion.unsubscribe();
    this.subValidaton.unsubscribe();
  }

  validateAnswer() {
    // let valid: boolean = true;
    // for (let i = 0; i < this.currentQuestion.answers.length; i++) {
    //   if (this.currentQuestion.answers[i].correct) {
    //     if (!this.selectedAnswers.includes(i)) valid = false;
    //   } else {
    //     if (this.selectedAnswers.includes(i)) valid = false;
    //   }
    // }

    // this.quizHandler.addToAnswers(this.selectedAnswers.map(value => value.toString()), valid);
    // this.quizHandler.handleValidation(valid);
    this.selectedAnswers.forEach(element => {
      this.currentQuestion.answers[element].chosen=true;
    });
    let correct: boolean = true;
    this.currentQuestion.answers.forEach(element => {
      if (element.correct !== element.correct)
        correct = false;
    });
    this.currentQuestion.correct = correct;

    this.qHandler.handleValidation(true);
  }
}
