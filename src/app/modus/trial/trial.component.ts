import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionHandlingService } from '../shared/question-handling.service';
import { Observable, Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { QuizHandlingService } from '../shared/quiz-handling.service';
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
  question: Question;
  questionIndex: number;
  numberQuestions: number;
  skipped$: Observable<Question[]>;
  errorMsg: ErrorMsg = {header:"",body: "", critical: false};
  maxQuestSeen: number = 0;

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;
  items: MenuItem[];

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) => {
      this.quizType = params.get('modus');
      this.quizHandler.initQuiz(this.quizType);
      this.qHandler.loadQuestions(params.get('collection'), this.quizType);
    });
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      this.question = question;
      this.questionIndex = this.qHandler.currentIndex;
      this.maxQuestSeen = Math.max(this.questionIndex, this.maxQuestSeen);
      this.numberQuestions = this.qHandler.questions.length;
    });
    this.skipped$ = this.quizHandler.skipped$;
    this.subError = this.quizHandler.errorMsg$.subscribe(
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

  onExit() {
    console.log('show results');
  }

  onSkip() {
    this.quizHandler.addToSkip(this.question);
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Frage übersprungen',
      detail: 'Die Frage wurde für später vorgemerkt.',
    });
    this.qHandler.nextQuestion();
  }

  onSubmit() {
    this.quizHandler.validate();
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
}
