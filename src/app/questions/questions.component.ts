import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { StateService } from '../state.service';
import { MatSliderChange } from '@angular/material/slider';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions: Question[]  = this.stateService.getQuestions()
  
  yesActive=false;
  noActive=false;
  resultActive=false;
  index:number=1
  
  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.getUpdates()
    this.getSurveyComplete()
    this.getAnswer(this.index-1)
  }

  
  getUpdates(): void {
    this.stateService.getUpdates().subscribe(answer=>{if(answer.id==this.index-1){this.yesActive=answer.yesActive, this.noActive=answer.noActive}});
  }
  
  getSurveyComplete(): void {
    this.stateService.getSurveyComplete().subscribe(answer=>this.resultActive=answer);
  }
  
  
  updateIndex(index: number): void {
    this.index = index;
    this.getAnswer(index-1)
  }
  
  nextQuestion(): void {
    let question= (this.index%this.questions.length)+1
    this.updateIndex(question)
  }
  
  onSliderUpdate($event: MatSliderChange) {
    if($event.value!=null){
      this.updateIndex($event.value)
    }
  }
  
  
  onYes(){
    this.stateService.answerUpdateYes(this.index-1)
    if(this.index<this.questions.length){
      this.nextQuestion()
    }
  }
  onNo(){
    this.stateService.answerUpdateNo(this.index-1)
    if(this.index<this.questions.length){
      this.nextQuestion()
    }
  }
  
  onResultClick(){
    this.stateService.resultButtonClicked()
  }
   
  getAnswer(id: number): void {
    let ans = this.stateService.getAnswer(id)
    this.yesActive=ans.yesActive
    this.noActive=ans.noActive
  }
  
  

}
