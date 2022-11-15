import { Component, OnInit } from '@angular/core';
import { Result } from '../result';
import { StateService } from '../state.service';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  employable:string="Blockchain adoption is discouraged"
  useful:string="Not applicable, blockchain adoption is discouraged"
  solutions:string="No alternative solutions"
  constructor(private stateService:StateService) { }

  ngOnInit(): void {
    let result=this.stateService.computeResult()
    if (result.feasibility=="recommended"){
      this.employable="Blockchain adoption is recommended"
    }
    else if (result.feasibility=="suboptimal") {
      this.employable="Blockchain is usable but other technologies might be more suitable"
    }
    if (result.feasibility!="infeasible")
    {
      if (result.sufficiency=="sufficient"){
        this.useful="Blockchain is likely to deliver the expected value proposition"
      }
      else{
        this.useful="Blockchain might fail to deliver the expected value proposition. Nonetheless, such a goal could be achieved by coupling blockchain with other technologies to prevent proactive data manipulation and by implementing opportune strategies to include all the relevant actors in the management of the system"
      }
    }
    if (result.solutions.length>0){
      this.solutions=result.solutions.join('\n')
    }
    
    
  }
  
  onBack(){
    this.stateService.backButtonClicked()
  }
  
  onReset(){
    this.stateService.resetButtonClicked()
  }

}
