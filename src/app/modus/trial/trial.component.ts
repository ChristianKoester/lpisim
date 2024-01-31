import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionHandlingService } from '../shared/question-handling.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ErrorMsg } from '../shared/error-msg.model';

@Component({
  selector: 'lpi-trial',
  templateUrl: './trial.component.html',
  styleUrl: './trial.component.css',
  providers: [MessageService],
})
export class TrialComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  private subError: Subscription;
  quizType = '';
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  errorMsg: ErrorMsg = {header:"",body: "", critical: false};
  maxQuestionsSeen: number = 0;

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;

  constructor(
    private qHandler: QuestionHandlingService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) => {
      this.quizType = params.get('modus');
      this.qHandler.loadQuestions(params.get('collection'), this.quizType);
    });

    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      this.currentQuestion = question;
      this.currentIndex = this.qHandler.currentIndex;
      this.maxQuestionsSeen = Math.max(this.currentIndex, this.maxQuestionsSeen);
      this.totalQuestions = this.qHandler.getAllQuestions().length;
    });

    this.subError = this.qHandler.errorMsg$.subscribe(
      error => { 
        this.errorMsg = error;
        this.dialogVisible = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.subRoute.unsubscribe();
    this.subQuestion.unsubscribe();
    this.subError.unsubscribe();
  }

  onNextQuestion() {
    this.qHandler.nextQuestion();
  }

  onPreviousQuestion() {
    this.qHandler.previousQuestion();
  }

  onSpecificQuestion(index: number) {
    this.qHandler.specificQuestion(index);
    this.sidebarVisible = false;
  }

  onSkip() {
    this.qHandler.setSkip();
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Frage übersprungen',
      detail: 'Die Frage wurde für später vorgemerkt.',
    });
    this.qHandler.nextQuestion();
  }

  onSubmit() {
    this.qHandler.validateQuestion();
  }

  onShowSidebar() {
    this.sidebarVisible = true;
  }

  onCloseDialog() {
    this.dialogVisible = false;
    if (this.errorMsg.critical) {
      this.router.navigateByUrl(`/${this.quizType}/result`);
    }
  }

  getAllQuestions(): Question[] {
    return this.qHandler.getAllQuestions();
  }
}
