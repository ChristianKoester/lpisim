import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../shared/options.service';

@Component({
  selector: 'lpi-options',
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent implements OnInit {
  shuffleCheck: boolean;
  shuffleExam: boolean;
  qMaxCheck: number;
  qMaxExam:number;

  constructor(private optionService: OptionsService) {}
  
  ngOnInit(): void {
    this.optionService.loadOptions();
    this.shuffleCheck = this.optionService.options.shuffleCheck;
    this.shuffleExam = this.optionService.options.shuffleExam;
    this.qMaxCheck = this.optionService.options.qMaxCheck;
    this.qMaxExam = this.optionService.options.qMaxExam;
  }

  onSaveOptions() {
    this.optionService.setOptions(
      this.shuffleCheck,
      this.shuffleExam,
      this.qMaxCheck,
      this.qMaxExam,
    )
  }
}
