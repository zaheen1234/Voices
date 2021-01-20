import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { QuestionServiceService } from '../services/questionService/question-service.service';

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
               private changeRef: ChangeDetectorRef, private platform: Platform) {


  }


  // submit() {
  //   if (this.username === '') {
  //     alert('Mobile number can not be blank');
  //     this.username = '';
  //   } else {
  //    // alert('OTP has been sent');
  //     this.normalMode = false;
  //     this.otpMode = true;
  //   }
  // }

  // submitOTP(otp) {
  //   if (otp === '') {
  //     alert('OTP can not be blank');
  //   } else if (otp === '123456') {
  //     this.callAPI();
  //   } else {
  //     alert('OTP is invalid');
  //     this.password = '';
  //   }
  // }


  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.question = this.questionService.getCurrentQuestion();
    alert('Height : ' + this.platform.height());
    alert('Width : ' + this.platform.width() );
    

  }

  goToHomepage() {
    this.route.navigate(['/homepage']);
  }

  goToRecordingsList() {
    this.route.navigate(['/recordings-list']);
  }

  goToAnswerScreen() {
    this.route.navigate(['/record-answer'])
  }

  skipCurrentQuestion() {
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
