import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionHandlingService } from '../shared/question-handling.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorMsg } from '../shared/error-msg.model';
import { ErrorMessageService } from '../shared/error-message.service';

@Component({
  selector: 'lpi-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
  providers: [ConfirmationService, MessageService],
})
export class QuizComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  private subError: Subscription;
  quizType = '';
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  errorMsg: ErrorMsg = { header: '', body: '', critical: false };
  maxQuestionsSeen: number = 0;

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;

  constructor(
    private qHandler: QuestionHandlingService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorMsgServ: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) => {
      this.quizType = params.get('modus');
      this.qHandler.loadQuestions(params.get('collection'), this.quizType);
      this.maxQuestionsSeen = 0;
    });

    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      this.currentQuestion = question;
      this.currentIndex = this.qHandler.currentIndex;
      this.maxQuestionsSeen = Math.max(
        this.currentIndex,
        this.maxQuestionsSeen
        );
        this.totalQuestions = this.qHandler.totalQuestions;
    });

    this.subError = this.errorMsgServ.errorMsg$.subscribe((error) => {
      this.errorMsg = error;
      this.dialogVisible = true;
    });
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
      detail: 'Die Frage wurde in der Sidebar vorgemerkt.',
    });
    this.qHandler.nextQuestion();
  }

  onSubmit(event: Event) {
    this.qHandler.validateQuestion();
    if (this.currentIndex === this.totalQuestions - 1) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message:
          'Das war die letzte Frage. Möchtest du zur Auswertung oder deine Antworten nocheinmal überprüfen?',
        header: 'Letzte Frage',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'pi pi-check',
        acceptLabel: ' Ergebnis',
        rejectIcon: 'pi pi-search',
        rejectLabel: ' Überprüfen',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigateByUrl(`/${this.quizType}/result`);
        },
        reject: () => {},
      });
    }
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
