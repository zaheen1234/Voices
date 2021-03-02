import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { MediaCapture } from '@ionic-native/media-capture';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { Vibration } from '@ionic-native/vibration/ngx';


@Component({
  selector: 'app-record-answer',
  templateUrl: './record-answer.page.html',
  styleUrls: ['./record-answer.page.scss'],
})
export class RecordAnswerPage implements OnInit {

  constructor(private route: Router, private media: Media, private file: File,
    private platform: Platform, private changeRef: ChangeDetectorRef,
    private questionService: QuestionServiceService, private vibration: Vibration,
    private alertController: AlertController
  ) { }

  enable1 = false;
  enable2 = false;
  enable3 = false;
  enable4 = false;
  enable5 = false;
  started = false;
  animation = false;

  isRecord = true;
  isPaused = false;
  cancelModeDisable = true;
  cancelModeEnable = false;
  recording: boolean = false;
  pause: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  question = this.questionService.getCurrentQuestion();
  lenOfQuestion = this.question.question.length;
  questionRange: boolean = false;
  protected interval: any;
  public progress = 0;
  showGif: boolean = false;
  showPlain: boolean = true;
  recordingStarted: boolean = false;
  protected timer: any;
  public countdown = 0;
  public countdown1 = 0;
  timerShouldStart: boolean = false;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  hours1: number = 0;
  minutes1: number = 0;
  seconds1: number = 0;
  showLow: boolean = false;
  showMedium: boolean = false;
  showHigh: boolean = false;
  previousPeersAvailable: boolean = false;
  nextPeersAvailable: boolean = false;
  androidRecordingArray = [];
  testArray = [];
  fileNum: number = 0;


  ngOnInit() {
    console.log('ngOnit Called on Record Answer Page');
    this.previousPeersAvailable = false;
    this.nextPeersAvailable = false;

    this.question = this.questionService.getCurrentQuestion();
    this.lenOfQuestion = this.question.question.length;
    console.log('lenght of question : ', this.lenOfQuestion);
    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }
    console.log('init called');
    this.enable5 = true;
    this.timerShouldStart = false;
    this.countdown = 0;
    this.startTimerFirst();
  }

  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
  }

  stopRecord() {
    this.timerShouldStart = false;
    this.audio.stopRecord();
    this.recordingStarted = false;
    this.audio.release();
    this.stopInterval();
    this.audio = null;
    this.getMinutesTimer();

    let data1 = { filename: this.fileName };
    // this.audioList.push(data1);
    this.androidRecordingArray.push(data1);
    // localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    // this.getAudioList();
    alert(JSON.stringify(this.androidRecordingArray));
    return;
    this.audio.stopRecord();
    this.recordingStarted = false;
    this.audio.release();
    this.stopInterval();
    this.audio = null;
    console.log('checking timer : ', this.countdown);
    this.getMinutesTimer();
    let data = {
      filename: this.fileName, question: this.question.question, id: this.question.id,
      date: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear(),
      hours: this.hours, minutes: this.minutes, seconds: this.seconds, totalSeconds: this.countdown
    };
    console.log('checking what data is going to save : ', JSON.stringify(data));
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

  startRecord() {
    this.timerShouldStart = true;
    this.startCountdown();
    this.vibration.vibrate(100);

    this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new
      Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new
        Date().getSeconds() + '.3gp';

    this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    
    
    this.recordingStarted = true;
    this.startInterval();
    this.recording = true;
  }

  startCountdown() {

    if (this.timerShouldStart) {
      setTimeout(() => {
        this.countdown = this.countdown + 1;
        this.startCountdown();
      }, 1000);
    }

  }

  startInterval() {
    console.log('startInterval called');
    const self = this;
    this.interval = setInterval(_ => {
      self.progress = self.progress + 1;
      this.audio.getCurrentAmplitude().then((data) => {
        if (data < 0.1) {
          console.log('checking amplitude: ', data);
          this.showLow = true;
          this.showMedium = false;
          this.showHigh = false;

          this.changeRef.detectChanges();
        } else if (data > 0.1 && data < 0.7) {
          console.log('MEDIUM amplitude: ', data);
          this.showMedium = true;
          this.showLow = false;
          this.showHigh = false;

          this.changeRef.detectChanges();
        } else if (data > 0.7) {
          console.log('checking amplitude: ', data);
          this.showHigh = true;
          this.showLow = false;
          this.showMedium = false;

          this.changeRef.detectChanges();
        }
      })
    }, 500);
  }

  stopInterval() {
    this.showGif = false;
    this.showPlain = true;
    clearInterval(this.interval);
    console.log('stop enterval called');
  }

  getMinutesTimer() {

    if (this.countdown > 3600) {
      let hour: number;
      hour = this.countdown / 3600;
      let roundOffOfHour: number;
      roundOffOfHour = Math.floor(hour);
      this.hours = roundOffOfHour;
      console.log('checking hour : ', roundOffOfHour);
      let localMin = roundOffOfHour * 3600;
      console.log('checking localMin : ', localMin);
      let actualMin = this.countdown - localMin;
      if (actualMin > 60) {
        console.log('checking totalsecs : ', this.countdown);
        let min: number;
        min = this.countdown / 60;
        let roundOffOfMin: number;
        roundOffOfMin = Math.floor(min);
        console.log('checking min: ', roundOffOfMin);
        let localSec = roundOffOfMin * 60;
        console.log('checking localSec : ', localSec)
        let thenSec = this.countdown - localSec;
        console.log('checking remaining sec : ', thenSec);
        this.minutes = roundOffOfMin;
        this.seconds = thenSec;
        return;
      } else {
        this.minutes = 0;
        this.seconds = actualMin;
        return;
      }

    }
    if (this.countdown > 60) {
      console.log('checking totalsecs : ', this.countdown);
      let min: number;
      min = this.countdown / 60;
      let roundOffOfMin: number;
      roundOffOfMin = Math.floor(min);
      console.log('checking min: ', roundOffOfMin);
      let localSec = roundOffOfMin * 60;
      console.log('checking localSec : ', localSec)
      let thenSec = this.countdown - localSec;
      console.log('checking remaining sec : ', thenSec);
      this.minutes = roundOffOfMin;
      this.seconds = thenSec;
      return;
    }

    this.minutes = 0;
    this.seconds = this.countdown;

  }


  getAudioList() {
    if (localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
    this.timerShouldStart = false;
    this.countdown = 0;
  }


  // 5 timers for displaying count down before audio recording starts

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  backToQuestionScreen() {
    this.androidRecordingArray = [];
    this.vibration.vibrate(100);
    this.route.navigate(['/home']);


  }

  backToRecording() {
    this.vibration.vibrate(100);
    this.isPaused = false;
    this.isRecord = true;
    this.specialResumeForAndroid();
    this.changeRef.detectChanges();

  }


  async goToCancelScreen() {

    this.pauseFuncForAndroid();
    this.isPaused = true;
    this.isRecord = false;
    this.changeRef.detectChanges();
    this.vibration.vibrate(100);
    const alart = await this.alertController.create({
      cssClass: 'basic-alert',
      header: 'Are you sure you want to cancel your recording?',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            this.backToQuestionScreen();
          },
          cssClass: 'failure-button'
        },
        {
          text: 'NO',
          role: 'cancel',
          handler: (blah) => {
            this.backToRecording();
          },
          cssClass: 'failure-button'
        }
      ]
    });
    await alart.present();
    return;

  }

  resumeRecording() {
    this.vibration.vibrate(100);
    this.isRecord = true;
    this.isPaused = false;
    this.specialResumeForAndroid();
  }

  saveRecording() {
    //this.stopRecord();
    this.newSaveRecording();
    this.vibration.vibrate(100);
    this.route.navigate(['/success-page']);
  }

  pauseRecording() {
    this.vibration.vibrate(100);
    console.log('funct called');
    this.isRecord = false;
    this.isPaused = true;
    this.changeRef.detectChanges();
    this.pauseFuncForAndroid();
    // if (this.recordingStarted){
    //   if (this.platform.is('android')){
    //       this.pauseFuncForAndroid();
    //       this.recordingStarted = false;

    //   } else {
    //     this.audio.pauseRecord();
    //     this.recordingStarted = false;
    //   }


    // }

  }

  newSaveRecording() {

    if (this.timerShouldStart) {
      this.audio.stopRecord();
      this.audio.release();
      this.timerShouldStart = false;
      this.stopInterval();
      this.audio = null;
      this.getMinutesTimer();
      this.androidRecordingArray.push(this.fileName);
    } else {
      // do nothing
      this.getMinutesTimer();

    }
    let length = this.androidRecordingArray.length - 1;



    if (this.androidRecordingArray.length == 1) {
      let data = {
        filename: this.androidRecordingArray,
        previousPeer: false,
        nextPeer: false,
        nextFileName: null,
        question: this.question.question, id: this.question.id,
        date: new Date().getDate(), month: new Date().getMonth() + 1,
        year: new Date().getFullYear(), hours: this.hours, minutes: this.minutes,
        seconds: this.seconds, totalSeconds: this.countdown
      };
      this.audioList.push(data);
      localStorage.setItem("audiolist", JSON.stringify(this.audioList));
      this.testArray.push(data)
    } else {
      
      // let newCountDown = this.countdown * 20/100;
      // let temp = Math.ceil(newCountDown);
      this.countdown1 = this.countdown;
      this.getMinutesTimer1();
      for (let i = 0; i < this.androidRecordingArray.length; i++) {
        if (i == 0) {
          let data = {
            filename: this.androidRecordingArray[i],
            previousPeer: false,
            nextPeer: true,
            nextFileName: this.androidRecordingArray[i + 1],
            question: this.question.question, id: this.question.id,
            date: new Date().getDate(), month: new Date().getMonth() + 1,
            year: new Date().getFullYear(), hours: this.hours1, minutes: this.minutes1,
            seconds: this.seconds1, totalSeconds: this.countdown1
          };
          this.audioList.push(data);
          localStorage.setItem("audiolist", JSON.stringify(this.audioList));
          this.testArray.push(data)
        }
        else if (i == length) {
          let data = {
            filename: this.androidRecordingArray[i],
            previousPeer: true,
            nextPeer: false,
            nextFileName: null,
            question: this.question.question, id: this.question.id,
            date: new Date().getDate(), month: new Date().getMonth() + 1,
            year: new Date().getFullYear(), hours: this.hours1, minutes: this.minutes1,
            seconds: this.seconds1, totalSeconds: this.countdown1
          };
          this.audioList.push(data);
          localStorage.setItem("audiolist", JSON.stringify(this.audioList));
          this.testArray.push(data)
        } else {
          let data = {
            filename: this.androidRecordingArray[i],
            previousPeer: true,
            nextPeer: true,
            nextFileName: this.androidRecordingArray[i + 1],
            question: this.question.question, id: this.question.id,
            date: new Date().getDate(), month: new Date().getMonth() + 1,
            year: new Date().getFullYear(), hours: this.hours1, minutes: this.minutes1,
            seconds: this.seconds1, totalSeconds: this.countdown1
          };
          this.audioList.push(data);
          localStorage.setItem("audiolist", JSON.stringify(this.audioList));
          this.testArray.push(data)
        }
      }
    }
  }

  pauseFuncForAndroid() {
    this.timerShouldStart = false;
    this.startCountdown();
    this.audio.stopRecord();
    this.audio.release();
    this.stopInterval();
    this.audio = null;
    this.androidRecordingArray.push(this.fileName);

  }

  specialResumeForAndroid() {
    this.startInterval();
    this.startRecord();
  }

  getMinutesTimer1() {

    if (this.countdown1 > 3600) {
      let hour: number;
      hour = this.countdown1 / 3600;
      let roundOffOfHour: number;
      roundOffOfHour = Math.floor(hour);
      this.hours1 = roundOffOfHour;
      console.log('checking hour : ', roundOffOfHour);
      let localMin = roundOffOfHour * 3600;
      console.log('checking localMin : ', localMin);
      let actualMin = this.countdown1 - localMin;
      if (actualMin > 60) {
        let min: number;
        min = this.countdown1 / 60;
        let roundOffOfMin: number;
        roundOffOfMin = Math.floor(min);
        console.log('checking min: ', roundOffOfMin);
        let localSec = roundOffOfMin * 60;
        console.log('checking localSec : ', localSec)
        let thenSec = this.countdown1 - localSec;
        console.log('checking remaining sec : ', thenSec);
        this.minutes1 = roundOffOfMin;
        this.seconds1 = thenSec;
        return;
      } else {
        this.minutes1 = 0;
        this.seconds1 = actualMin;
        return;
      }

    }
    if (this.countdown1 > 60) {
      let min: number;
      min = this.countdown1 / 60;
      let roundOffOfMin: number;
      roundOffOfMin = Math.floor(min);
      console.log('checking min: ', roundOffOfMin);
      let localSec = roundOffOfMin * 60;
      console.log('checking localSec : ', localSec)
      let thenSec = this.countdown1 - localSec;
      console.log('checking remaining sec : ', thenSec);
      this.minutes1 = roundOffOfMin;
      this.seconds1 = thenSec;
      return;
    }

    this.minutes1 = 0;
    this.seconds1 = this.countdown1;

  }


  startTimerFirst() {

    setTimeout(() => {
      this.enable5 = false;
      this.startTimerSecond();
    }, 1000);
  }

  startTimerSecond() {
    this.enable4 = true;

    setTimeout(() => {
      this.enable4 = false;
      this.startTimerThird();
    }, 1000);
  }

  startTimerThird() {
    this.enable3 = true;

    setTimeout(() => {
      this.enable3 = false;
      this.startTimerFourth();
    }, 1000);
  }

  startTimerFourth() {
    this.enable2 = true;

    setTimeout(() => {
      this.enable2 = false;
      this.startTimerFifth();
    }, 1000);
  }

  startTimerFifth() {
    this.enable1 = true;

    setTimeout(() => {
      this.enable1 = false;
      this.startTimerStarted();
    }, 1000);
  }

  startTimerStarted() {
    this.started = true;

    setTimeout(() => {
      this.started = false;
      this.animation = true;
      this.startRecord();
    }, 1000);
  }


}
