import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FileParserService } from './file-parser.service';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  
  constructor(private fps: FileParserService) {}

  async createDb() {
    const lpic101 = await this.fps.getQuestions('lpic101')
      .then((data) => { return data } );
    const lpic102 = await this.fps.getQuestions('lpic102')
      .then((data) => { return data } );
    return { lpic101, lpic102 };
  }
}
