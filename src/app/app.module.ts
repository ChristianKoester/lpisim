//Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InMemoryDataService } from './shared/in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

//PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';

//App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LearnListComponent } from './learn/learn-list/learn-list.component';
import { LearnSingleComponent } from './learn/learn-single/learn-single.component';
import { CheckComponent } from './quiz/check/check.component';
import { ExamComponent } from './quiz/exam/exam.component';
import { SingleChoiceComponent } from './quiz/shared/single-choice/single-choice.component';
import { MultiChoiceComponent } from './quiz/shared/multi-choice/multi-choice.component';
import { FillInComponent } from './quiz/shared/fill-in/fill-in.component';

@NgModule({
  declarations: [
    AppComponent,
    LearnListComponent,
    HomeComponent,
    HeaderComponent,
    LearnSingleComponent,
    CheckComponent,
    ExamComponent,
    SingleChoiceComponent,
    MultiChoiceComponent,
    FillInComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { delay: 0 , dataEncapsulation: false}
    ),
    MenubarModule,
    CardModule,
    BrowserAnimationsModule,
    FieldsetModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
