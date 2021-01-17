import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {

  deleteModeDisable = true;
  deleteModeEnable = false;
  constructor(private route: Router, private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  nextQuestion() {
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
