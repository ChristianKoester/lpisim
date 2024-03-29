import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearnListComponent } from './modus/learn/learn-list/learn-list.component';
import { HomeComponent } from './home/home.component';
import { LearnSingleComponent } from './modus/learn/learn-single/learn-single.component';
import { QuizComponent } from './modus/quiz/quiz.component';
import { ResultComponent } from './modus/shared/result/result.component';
import { OptionsComponent } from './options/options.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'learn/list/:collection', component: LearnListComponent },
  { path: 'learn/single/:collection', redirectTo: 'learn/single/:collection/1', pathMatch: 'full' },
  { path: 'learn/single/:collection/:id', component: LearnSingleComponent },
  { path: ':modus/result', component: ResultComponent},
  { path: ':modus/:collection', component: QuizComponent},
  { path: 'options', component: OptionsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
