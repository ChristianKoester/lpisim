import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute } from '@angular/router';
import { QuestionHandlingService } from '../shared/question-handling.service';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { QuizHandlingService } from '../shared/quiz-handling.service';

@Component({
  selector: 'lpi-exam',
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  providers: [MessageService],
})
export class ExamComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  quizType = '';
  // private subValidation: Subscription;
  question: Question;
  questionIndex: number;
  numberQuestions: number;
  skipped: number[] = [];

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;
  items: MenuItem[];

  constructor(
    private qHandler: QuestionHandlingService,
    private quizHandler: QuizHandlingService,
    private route: ActivatedRoute,
    // private router: Router,
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
      this.qHandler.loadQuestions(params.get('collection'), false, 100);
    });
    this.subQuestion = this.qHandler.question$.subscribe((question) => {
      this.question = question;
      this.questionIndex = this.qHandler.currentIndex;
      this.numberQuestions = this.qHandler.questions.length;
    });
    // this.subValidation = this.qHandler.validationComplete$.subscribe(() =>
    //   this.handleValidation()
    // );
  }

  ngOnDestroy(): void {
    this.subRoute.unsubscribe();
    this.subQuestion.unsubscribe();
    // this.subValidation.unsubscribe();
  }

  onNextQuestion() {
    this.qHandler.nextQuestion();
  }

  onPreviousQuestion() {
    this.qHandler.previousQuestion();
  }

  onSpecificQuestion(index: number) {
    this.qHandler.specificQuestion(this.skipped[index]);
    this.sidebarVisible = false;
  }

  onExit() {
    console.log('show results');
  }

  onSkip() {
    this.skipped = this.quizHandler.addToSkip();
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

  // Muss das hier sein? Redundanz zwischen Check und Exam? 
  // Check & Exam vereinen und Logik in Service?
  // handleValidation() {
  //   const falseAnswers = this.qHandler.answerdQuestions.filter(
  //     (val) => !val.correct
  //   ).length;
  //   if (
  //     falseAnswers >= this.numberQuestions * 0.2 ||
  //     this.questionIndex === this.numberQuestions - 1
  //   ) {
  //     this.router.navigateByUrl('/exam/result');
  //   } else {
  //     this.qHandler.nextQuestion();
  //   }
  // }

  private showSidebar() {
    this.sidebarVisible = true;
  }
}
