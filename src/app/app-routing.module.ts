import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './result/result.component';
import { QuestionsComponent } from './questions/questions.component';
const routes: Routes = [{path: '', component: QuestionsComponent}, {path: 'result', component: ResultComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
