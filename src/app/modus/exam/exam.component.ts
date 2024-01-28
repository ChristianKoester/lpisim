import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../shared/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModusHandlingService } from '../shared/modus-handling.service';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'lpi-exam',
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
  providers: [MessageService],
})
export class ExamComponent implements OnInit, OnDestroy {
  private subRoute: Subscription;
  private subQuestion: Subscription;
  private subValidation: Subscription;
  question: Question;
  questionIndex: number;
  numberQuestions: number;
  skipped: Question[] = [];

  dialogVisible: boolean = false;
  sidebarVisible: boolean = false;
  items: MenuItem[];

  constructor(
    private modusHandler: ModusHandlingService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.items = [
      {
          label: 'Liste zeigen',
          icon: 'pi pi-refresh',
          command: () => {
            this.showSidebar();
          }
      }]
  }

  showSidebar() {
    this.sidebarVisible = true;
  }

  ngOnInit(): void {
    this.subRoute = this.route.paramMap.subscribe((params) => {
      this.modusHandler.loadQuestions(params.get('collection'), false, 100);
    });
    this.subQuestion = this.modusHandler.question$.subscribe((question) => {
      this.question = question;
      this.questionIndex = this.modusHandler.currentIndex;
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

  onSpecificQuestion(index: number) {
    this.modusHandler.specificQuestion(this.skipped[index].id);
    this.sidebarVisible = false;
  }

  onExit() {
    console.log('show results');
  }

  onSkip() {
    this.skipped.push(this.question);
    this.modusHandler.addToSkip();
    this.messageService.add({
      key: 'tc',
      severity: 'info',
      summary: 'Frage übersprungen',
      detail: 'Die Frage wurde für später vorgemerkt.',
    });
    this.modusHandler.nextQuestion();
  }

  onSubmit() {
    this.modusHandler.validate();
  }

  // Muss das hier sein? Redundanz zwischen Check und Exam? 
  // Check & Exam vereinen und Logik in Service?
  handleValidation() {
    const falseAnswers = this.modusHandler.selectedAnswers.filter(
      (val) => !val.correct
    ).length;
    if (
      falseAnswers >= this.numberQuestions * 0.2 ||
      this.questionIndex === this.numberQuestions - 1
    ) {
      this.router.navigateByUrl('/exam/result');
    } else {
      this.modusHandler.nextQuestion();
    }
  }
}
