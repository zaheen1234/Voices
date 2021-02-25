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
  lenOfQuestion = this.question.question.length;
  questionRange: boolean = false;
  // tslint:disable-next-line:prefer-const

  constructor( private modalCtrl: ModalController, private http: HttpClient,
               private route: Router, private questionService: QuestionServiceService, 
               private changeRef: ChangeDetectorRef, private platform: Platform,
               private vibration: Vibration) {


  }

  ngOnInit() {
    // alert('height : ' + this.platform.height());
    // alert('width : ' + this.platform.width());
    this.lenOfQuestion = this.question.question.length;
    console.log('lenght of question : ', this.lenOfQuestion);
    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }

  }

  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
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
    this.lenOfQuestion = this.question.question.length;
    console.log('lenght of question : ', this.lenOfQuestion);

    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }
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
