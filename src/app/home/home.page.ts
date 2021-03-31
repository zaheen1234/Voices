import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
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
  resumeCounter = 0;

  // tslint:disable-next-line:prefer-const

  constructor( private modalCtrl: ModalController, private http: HttpClient,
               private route: Router, private questionService: QuestionServiceService, 
               private changeRef: ChangeDetectorRef, private platform: Platform,
               private vibration: Vibration, private media: Media, private file: File) {
                
  }


  ngOnInit() {
  
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

    this.startTimerFirst();
  }

  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
  }


  startTimerFirst() {
    setTimeout(() => {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.M4a';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
      this.audio.startRecord();
      this.audio.stopRecord();
    }, 1000);
  }
  ionViewWillLeave() {
   
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

  goToHomepage() {
    this.route.navigate(['/homepage']);
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  goToAnswerScreen() {
    if (this.allQuetionsFinished) {
      return;
    }
    this.vibration.vibrate(100);
    this.route.navigate(['/record-answer'])
  }

  skipCurrentQuestion() {
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

}
