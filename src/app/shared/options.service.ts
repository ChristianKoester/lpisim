import { Injectable, OnInit } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class OptionsService implements OnInit {
  options = {
    shuffleCheck: false,
    shuffleExam: false,
    qMaxCheck: 0,
    qMaxExam: 0,
  };

  constructor(private localStorage: LocalStorageService) {
    this.loadOptions();
  }

  ngOnInit(): void {}

  loadOptions(): void {
    const loadedItem = this.localStorage.getData('options');
    if (loadedItem) {
      this.options = JSON.parse(loadedItem);
    }
  }

  setOptions(
    shuffleCheck: boolean,
    shuffleExam: boolean,
    qMaxCheck: number,
    qMaxExam: number
  ) {
    this.options.shuffleCheck = shuffleCheck;
    this.options.shuffleExam = shuffleExam;
    this.options.qMaxCheck = qMaxCheck;
    this.options.qMaxExam = qMaxExam;
    this.localStorage.saveData('options', JSON.stringify(this.options));
  }
}