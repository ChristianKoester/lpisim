import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../shared/question.model';
import { QuestionService } from '../../shared/question.service';
import { FillInComponent } from '../../modus/shared/fill-in/fill-in.component';
import { MultiChoiceComponent } from '../../modus/shared/multi-choice/multi-choice.component';
import { SingleChoiceComponent } from '../../modus/shared/single-choice/single-choice.component';

@Component({
  selector: 'lpi-check',
  templateUrl: './check.component.html',
  styleUrl: './check.component.css'
})
export class CheckComponent {
  @ViewChild(SingleChoiceComponent) single: SingleChoiceComponent;
  @ViewChild(MultiChoiceComponent) multi: MultiChoiceComponent;
  @ViewChild(FillInComponent) fill: FillInComponent;

  questions: Question[];
  question: Question;
  id: number = 1;
  dialogVisible: boolean = false;

  constructor(private qServ: QuestionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const collection = params.get('collection');
      this.qServ.getQuestions(collection).subscribe((questions) => {
        this.questions = questions;
        this.question = this.questions.find((value) => value.id === this.id);
      });
    });
  }

  onNextQuestion() {
    this.id < this.questions.length ? this.id++ : this.id;
    this.question = this.questions.find((value) => value.id === this.id);
  }

  onPreviousQuestion() {
    this.id > 1 ? this.id-- : this.id;
    this.question = this.questions.find((value) => value.id === this.id);
  }

  onExit() {}
  
  onSkip() {}

  onSubmit() {
    switch (this.question.type) {
      case 'single':
        this.single.validateForm();
        break;
      case 'multi':
        this.multi.validateForm();
        break;
      case 'fill':
        this.fill.validateForm();
        break;
    }
  }

  onValidationComplete(valid: string) {
    if (valid === 'OK') {
      this.onNextQuestion();
    }
    else {
      this.dialogVisible = true;
      this.onPreviousQuestion();
    }
  }
}
