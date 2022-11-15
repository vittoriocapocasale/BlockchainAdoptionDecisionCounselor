import { Injectable } from '@angular/core';
import { Answer } from './answer';
import { Question } from './question';
import { Result } from './result';
import { QUESTIONS } from './constants';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StateService {


  answers:Array<Answer> = new Array<Answer>();
  lastUpdated:BehaviorSubject<Answer>=new BehaviorSubject<Answer>({id:0, yesActive:false, noActive:false})
  surveyComplete:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false)
  
  constructor(private router:Router) {
    this.initialize()
  }
  
  initialize(){
    this.answers=[]
    this.surveyComplete.next(false)
    for(let i=0; i<QUESTIONS.length; i++){
      let answer={id:i, yesActive:false, noActive:false}
      this.answers.push(answer); 
      this.lastUpdated.next(answer)
    }
  }
  
  getQuestions(): Question[] {
    return QUESTIONS
  }
  
  answerUpdateYes(questionId: number) {
    let answer={id:questionId, yesActive:true, noActive:false}
    this.answers[questionId]=answer
    this.lastUpdated.next(answer)
    this.surveyComplete.next(this.isAllAnswered())
  }
  
  answerUpdateNo(questionId: number) {
    let answer={id:questionId, yesActive:false, noActive:true}
    this.answers[questionId]=answer
    this.lastUpdated.next(answer) 
    this.surveyComplete.next(this.isAllAnswered())
  }
  
  getUpdates(): BehaviorSubject<Answer> {    
    return this.lastUpdated
  }
  
  getAnswer(questionId:number): Answer {    
    return this.answers[questionId]
  }
  
  getSurveyComplete(): BehaviorSubject<boolean> {    
    return this.surveyComplete
  }
  
  isAllAnswered(): boolean{
    let answered=0;
    this.answers.forEach(e=>{if(e.yesActive||e.noActive){answered++}})
    return answered==this.answers.length
  }
  
  navigate(url:string){
   this.router.navigateByUrl(url);
  }
  
  resultButtonClicked(){
    this.router.navigateByUrl("result")
  }
  resetButtonClicked(){
    this.initialize()
    this.router.navigateByUrl("")
  }
  backButtonClicked(){
    this.router.navigateByUrl("")
  }
  
  
  computeResult():Result {
    let solutions = []
    let isBlockchainPresent = false 
    if((this.answers[0].yesActive && this.answers[1].yesActive) || this.answers[0].noActive) {
      if(this.answers[9].yesActive){
        solutions.push("Centralized ledgers (e.g., ImmuDB or Amazon QLDB)")
      }
      else{
        solutions.push("Centralized databases (e.g., PostgreSQL, Apache Cassandra, MongoDB)")
      }
    }
    
    if(this.answers[0].yesActive && this.answers[1].noActive){
      if(this.answers[4].yesActive && this.answers[9].noActive){
          solutions.push("Independent databases (one per each actor) with a standard data exchange protocol")
      }
      if (this.answers[4].noActive){
          solutions.push("Independent databases (one per each actor)")
      }
    }
    if(!(this.answers[2].noActive || this.answers[3].noActive  || this.answers[5].noActive || this.answers[6].noActive || this.answers[8].noActive)){
      isBlockchainPresent=true 
    }
    
    let sufficiency="insufficient"
    let feasibility="infeasible"
    let isProactive = this.answers[10].yesActive
    let isInvolved = this.answers[7].yesActive
    if (isBlockchainPresent && solutions.length>0){
      feasibility = "suboptimal"
    }
    else if (isBlockchainPresent && solutions.length==0) {
      feasibility = "recommended"
    }
    if (!isProactive && isInvolved){
      sufficiency = "sufficient"
    }
    
    return {sufficiency: sufficiency, feasibility:feasibility, solutions: solutions}
  }
  
}


