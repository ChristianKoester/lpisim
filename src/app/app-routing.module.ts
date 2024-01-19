import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearnListComponent } from './learn/learn-list/learn-list.component';
import { HomeComponent } from './home/home.component';
import { LearnSingleComponent } from './learn/learn-single/learn-single.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'learn/list', component: LearnListComponent },
  { path: 'learn/single', component: LearnSingleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
