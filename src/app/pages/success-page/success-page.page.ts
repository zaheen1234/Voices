import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {

  deleteModeDisable = true;
  deleteModeEnable = false;
  question = this.questionService.getCurrentQuestion();

  constructor(private route: Router, private changeRef: ChangeDetectorRef,
    private questionService: QuestionServiceService) { }


  ngOnInit() {
    console.log('init called');
    this.question = this.questionService.getCurrentQuestion();

  }

  nextQuestion() {
    this.questionService.increaseQuestionIndex();
    this.route.navigate(['/home']);
  }

  deleteAnswer() {
    this.deleteModeDisable = false;
    this.deleteModeEnable = true;
  }

  backToQuestionScreen() {
    this.deleteModeDisable = true;
    this.deleteModeEnable = false;
    this.changeRef.detectChanges()
    this.route.navigate(['/home']); 
  }

  backToRecording () {
    console.log('gotorecording function called');
    this.deleteModeDisable = true;
    this.deleteModeEnable = false;
    this.changeRef.detectChanges();
  }
}
