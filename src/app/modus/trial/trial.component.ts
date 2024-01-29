import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute } from '@angular/router';
import { QuestionHandlingService } from '../shared/question-handling.service';
import { Observable, Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { QuizHandlingService } from '../shared/quiz-handling.service';

@Component({
  selector: 'lpi-trial',
  templateUrl: './trial.component.html',
  styleUrl: './trial.component.css',
  providers: [MessageService],
})
export class TrialComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  quizType = '';
  question: Question;
  questionIndex: number;
  numberQuestions: number;
  skipped$: Observable<Question[]>;

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;
  items: MenuItem[];

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.items = [
      {
          label: 'Liste zeigen',
          icon: 'pi pi-refresh',
          command: () => {
            this.showSidebar();
          }
      }];
  }

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) => {
      this.quizType = params.get('modus');
      this.quizHandler.initQuiz(this.quizType);
      this.qHandler.loadQuestions(params.get('collection'), false, 100);
    });
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      this.question = question;
      this.questionIndex = this.qHandler.currentIndex;
      this.numberQuestions = this.qHandler.questions.length;
    });
    this.skipped$ = this.quizHandler.skipped$;
  }

  ngOnDestroy(): void {
    this.subRoute.unsubscribe();
    this.subQuestion.unsubscribe();
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

  private showSidebar() {
    this.sidebarVisible = true;
  }
}
