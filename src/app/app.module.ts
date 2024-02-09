//Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

//PrimeNG
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

//App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryDataService } from './shared/in-memory-data.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LearnListComponent } from './modus/learn/learn-list/learn-list.component';
import { LearnSingleComponent } from './modus/learn/learn-single/learn-single.component';
import { QuizComponent } from './modus/quiz/quiz.component';
import { SingleChoiceComponent } from './modus/shared/single-choice/single-choice.component';
import { MultiChoiceComponent } from './modus/shared/multi-choice/multi-choice.component';
import { FillInComponent } from './modus/shared/fill-in/fill-in.component';
import { ResultComponent } from './modus/shared/result/result.component';
import { OptionsComponent } from './options/options.component';


@NgModule({
  declarations: [
    AppComponent,
    LearnListComponent,
    HomeComponent,
    HeaderComponent,
    LearnSingleComponent,
    QuizComponent,
    SingleChoiceComponent,
    MultiChoiceComponent,
    FillInComponent,
    ResultComponent,
    OptionsComponent,
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
    RippleModule,
    RadioButtonModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ChartModule,
    SidebarModule,
    InputSwitchModule,
    InputNumberModule,
    ToolbarModule,
    PanelModule,
    ConfirmDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
