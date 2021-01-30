import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { QuestionServiceService } from '../services/questionService/question-service.service';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username = '';
  password = '';
  otpMode = false;
  normalMode = true;
  question = this.questionService.getCurrentQuestion();
  // tslint:disable-next-line:prefer-const

  constructor( private modalCtrl: ModalController, private http: HttpClient,
               private route: Router, private questionService: QuestionServiceService, 
               private changeRef: ChangeDetectorRef, private platform: Platform,
               private vibration: Vibration) {


  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.question = this.questionService.getCurrentQuestion();
    console.log('checking actual this.question', this.question);
    // alert('Height : ' + this.platform.height());
    // alert('Width : ' + this.platform.width() );
  }

  goToHomepage() {
    this.route.navigate(['/homepage']);
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  goToAnswerScreen() {
    this.vibration.vibrate(100);
    this.route.navigate(['/record-answer'])
  }

  skipCurrentQuestion() {
    this.vibration.vibrate(100);
    this.questionService.increaseQuestionIndex();
    //this.question = this.questionService.increaseQuestionIndex();
    let localQuestion = this.questionService.getCurrentQuestion();
    console.log('checking the returned val', localQuestion);
    // console.log('checking current question', this.question);
    this.question = localQuestion;
    this.changeRef.detectChanges();
  }

//  async callAPI() {
                                     
//     let postParams = {"MobileNo":"8209090987","OTP":"123456","OTPType":"V","DeviceId":"ios123","ProgramType":"T","OSType":"IOS"};
//     let url = 'http://localhost/otp_api.php';

//     await this.http.post(url, JSON.stringify(postParams)).subscribe(data => {
//       console.log('this is response', data);
//       this.dataService.setData(data);
//       this.route.navigate(['/info']);

//     }, error => {
//       alert('this is error');
//     });
//   }
}
