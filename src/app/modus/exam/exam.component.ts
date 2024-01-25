import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute } from '@angular/router';
import { ModusHandlingService } from '../shared/modus-handling.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'lpi-exam',
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  providers: [MessageService]
})
export class ExamComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  private subValidation: Subscription;
  question: Question;
  numberQuestions: number;
  dialogVisible: boolean = false;

  constructor(
    private modusHandler: ModusHandlingService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe(params => 
      this.modusHandler.loadQuestions(params.get('collection')
    ));
    this.subQuestion = this.modusHandler.question$.subscribe(question => {
      this.question = question;
      this.numberQuestions = this.modusHandler.questions.length;
    });
    this.subValidation = this.modusHandler.validationComplete$.subscribe(() =>
      this.handleValidation()
    );
  }

  ngOnDestroy(): void {
    this.subRoute.unsubscribe();
    this.subQuestion.unsubscribe();
    this.subValidation.unsubscribe();
  }

  onNextQuestion() {
    this.modusHandler.nextQuestion();
  }

  onPreviousQuestion() {
    this.modusHandler.previousQuestion();
  }

  onExit() {
    console.log('show results')
  }

  onSkip() {
    console.log('enqueue skiplist')
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Frage übersprungen', detail: 'Die Frage wurde für später vorgemerkt.' });
    this.modusHandler.nextQuestion();
  }

  onSubmit() {
    this.modusHandler.validate()
  }

  handleValidation() {
    if (this.modusHandler.valid) {
      this.modusHandler.nextQuestion();
    }
    else {
      this.dialogVisible = true;
      this.modusHandler.previousQuestion();
    }
  }
}
