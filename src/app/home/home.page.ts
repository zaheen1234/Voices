import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { QuestionServiceService } from '../services/questionService/question-service.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';


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
  lenOfQuestion;
  questionRange: boolean = false;
  questionsArray = [];
  allQuetionsFinished: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  // tslint:disable-next-line:prefer-const

  constructor(private modalCtrl: ModalController, private http: HttpClient,
    private route: Router, private questionService: QuestionServiceService,
    private changeRef: ChangeDetectorRef, private platform: Platform,
    private vibration: Vibration, private alertController: AlertController,
    private media: Media, private file: File) {

    //     this.platform.backButton.subscribeWithPriority(1, () => {
    //       this.goToCancelScreen();
    // });

    this.platform.backButton.subscribe(() => {
      this.handlerOfBackButton();
    });


  }

  ngOnInit() {
    this.questionService.setLastRouteFunction('home');
    this.questionsArray = [];
    let questionsList = this.questionService.startQuestionService();
    this.question = this.questionService.getCurrentQuestion();
    // alert('checking question returned : ' + JSON.stringify(this.question));


    this.questionsArray.push(this.question);
    this.lenOfQuestion = this.questionsArray[0].question.length;
    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }

    if (this.questionsArray[0].question === "You have answered all the Questions!!!") {
      this.allQuetionsFinished = true;
    }

    this.startTimerFirst();

  }

  startTimerFirst() {
    setTimeout(() => {
      this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.M4a';
      this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
      this.audio.startRecord();
      this.audio.stopRecord();
      this.audio.release();
    }, 1000);
  }

  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
  }

  ionViewWillLeave() {
    this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.M4a';
    this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.audio.stopRecord();
    this.audio.release();
  }

  ionViewWillEnter() {

    this.questionsArray = [];
    let questionsList = this.questionService.startQuestionService();
    this.question = this.questionService.getCurrentQuestion();
    this.questionsArray.push(this.question);
    this.lenOfQuestion = this.questionsArray[0].question.length;
    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }

    if (this.questionsArray[0].question === "You have answered all the Questions!!!") {
      this.allQuetionsFinished = true;
    }
  }

  // ionViewWDidLeave() {
  //   this.questionService.setLastRouteFunction('home');
  // }



  goToHomepage() {
    this.route.navigate(['/homepage']);
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  goToAnswerScreen() {
    // this.vibration.vibrate(100);
    // this.route.navigate(['/record-answer'])

    if (this.allQuetionsFinished) {
      return;
    }
    this.vibration.vibrate(100);
    this.route.navigate(['/record-answer']);
  }

  skipCurrentQuestion() {
    // this.vibration.vibrate(100);
    // this.questionService.increaseQuestionIndex();
    // //this.question = this.questionService.increaseQuestionIndex();
    // let localQuestion = this.questionService.getCurrentQuestion();
    // console.log('checking the returned val', localQuestion);
    // // console.log('checking current question', this.question);
    // this.question = localQuestion;
    // this.lenOfQuestion = this.question.question.length;
    // console.log('lenght of question : ', this.lenOfQuestion);

    // if (this.lenOfQuestion > 70) {
    //   this.questionRange = true;
    // } else {
    //   this.questionRange = false;
    // }
    // this.changeRef.detectChanges();

    // copying new code from onlyiOS branch

    if (this.allQuetionsFinished) {
      return;
    }
    this.questionsArray = [];
    let abc = this.questionService.startQuestionService();
    this.questionService.increaseQuestionIndex();
    this.vibration.vibrate(100);

    this.question = this.questionService.getCurrentQuestion();

    this.questionsArray.push(this.question);
    this.lenOfQuestion = this.questionsArray[0].question.length;
    console.log('lenght of question : ', this.lenOfQuestion);

    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }
    this.changeRef.detectChanges();
  }

  handlerOfBackButton() {
    let lastRoute = this.questionService.getLastRouteFunction();
    // alert('checking what was the last route : ' + lastRoute);
    // return;


    if (lastRoute === 'home') {
      this.goToCancelScreen();
    } else {
      this.route.navigate(['/home']);
    }
  }

  async goToCancelScreen() {

    this.changeRef.detectChanges();
    this.vibration.vibrate(100);
    const alart = await this.alertController.create({
      cssClass: 'basic-alert',
      header: 'Do you want to close the App?',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            navigator['app'].exitApp();
          },
          cssClass: 'failure-button'
        },
        {
          text: 'NO',
          role: 'cancel',
          handler: (blah) => {
            // do nothing
          },
          cssClass: 'failure-button'
        }
      ]
    });
    await alart.present();
    return;

  }
}
