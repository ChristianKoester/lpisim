import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FileParserService } from './file-parser.service';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor(private fps: FileParserService) {}

  createDb() {
    const questions = this.fps.getQuestions();
    return { questions } ;
  } 

  //genid ??
}
