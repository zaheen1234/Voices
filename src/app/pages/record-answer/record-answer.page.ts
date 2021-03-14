import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, Platform } from '@ionic/angular';
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
  ) {
    // this.platform.resume.subscribe(() => {
    //   this.resumeCounter = this.resumeCounter + 1;
    //   if (this.resumeCounter === 1) {
    //     this.distroyFile();
    //   }
    // });
  }
  resumeCounter = 0;
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
  lenOfQuestion;
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
  showLow: boolean = false;
  showMedium: boolean = false;
  showHigh: boolean = false;
  questionArray = [];


  // distroyFile() {
  //   this.audio.stopRecord();
  //   this.audio.release();
  //   this.audio = null;
  //   this.questionService.setPermissionStatus('true');
  // }
  ngOnInit() {
    this.question = this.questionService.getCurrentQuestion();
    this.questionArray.push(this.question);
    this.lenOfQuestion = this.questionArray[0].question.length;
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
    this.audio.stopRecord();
    this.recordingStarted = false;
    this.audio.release();
    this.stopCountdown();
    this.stopInterval();
    this.audio = null;
    console.log('checking timer : ', this.countdown);
    this.getMinutesTimer();
    let data = {
      filename: this.fileName, question: this.questionArray[0].question, id: this.questionArray[0].id,
      date: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear(),
      hours: this.hours, minutes: this.minutes, seconds: this.seconds, totalSeconds: this.countdown1
    };
    console.log('checking what data is going to save : ', JSON.stringify(data));
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

  startRecord() {
    // this.vibration.vibrate(100);

    this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.M4a';
    this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.timerShouldStart = true;
    this.startCountdown();
    this.recordingStarted = true;
    this.startInterval();
    this.recording = true;
  }


  // timer to keep track of file duration
  startCountdown() {

    if (this.timerShouldStart) {
      setTimeout(() => {
        this.countdown = this.countdown + 1;
        this.startCountdown();
      }, 100);
    }

  }

  stopCountdown() {
    this.timerShouldStart = false;
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
    let tempTimer = this.countdown / 10;
    this.countdown1 = Math.floor(tempTimer);

    if (this.countdown1 > 3600) {
      let hour: number;
      hour = this.countdown1 / 3600;
      let roundOffOfHour: number;
      roundOffOfHour = Math.floor(hour);
      this.hours = roundOffOfHour;
      let localMin = roundOffOfHour * 3600;
      let actualMin = this.countdown1 - localMin;
      if (actualMin > 60) {
        let min: number;
        min = this.countdown1 / 60;
        let roundOffOfMin: number;
        roundOffOfMin = Math.floor(min);
        let localSec = roundOffOfMin * 60;
        let thenSec = this.countdown1 - localSec;
        this.minutes = roundOffOfMin;
        this.seconds = thenSec;
        return;
      } else {
        this.minutes = 0;
        this.seconds = actualMin;
        return;
      }

    }
    if (this.countdown1 > 60) {
      let min: number;
      min = this.countdown1 / 60;
      let roundOffOfMin: number;
      roundOffOfMin = Math.floor(min);
      let localSec = roundOffOfMin * 60;
      let thenSec = this.countdown1 - localSec;
      this.minutes = roundOffOfMin;
      this.seconds = thenSec;
      return;
    }

    this.minutes = 0;
    this.seconds = this.countdown1;

  }

  getSeconds() {

  }

  getAudioList() {
    if (localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {

//     let permissionStatus = this.questionService.getPermissionStatus();
//     if(permissionStatus === 'false') {
//     this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.M4a';
//     this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
//     this.audio = this.media.create(this.filePath);
//     this.audio.startRecord();
//  } else {
//         // do nothing
//     }
    this.getAudioList();
    this.timerShouldStart = false;
    this.countdown = 0;
  }

  // 5 timers for displaying count down before audio recording starts

  goToRecordingsList() {
    // this.vibration.vibrate(100);
    // this.route.navigate(['/recordings-list']);
  }

  backToQuestionScreen() {
    this.vibration.vibrate(100);
    this.route.navigate(['/home']);
  }

  backToRecording() {
    // this.vibration.vibrate(100);
    this.resumeRecording();
    this.isPaused = false;
    this.isRecord = true;
    this.changeRef.detectChanges();
  }


  async goToCancelScreen() {

    if(this.animation == false) {
      return;
    }

    this.pauseRecording();
    this.isPaused = true;
    this.isRecord = false;
    this.changeRef.detectChanges();
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
    this.changeRef.detectChanges();

    if (this.recordingStarted === false) {
      this.timerShouldStart = true;
      this.startCountdown();
      this.audio.resumeRecord();
      this.recordingStarted = true;
    }

  }

  saveRecording() {
    if(this.animation == false) {
      return;
    }
    this.stopRecord();
    this.vibration.vibrate(100);
    this.route.navigate(['/success-page']);
  }

  pauseRecording() {
    if(this.animation == false) {
      return;
    }
    this.vibration.vibrate(100);
    console.log('funct called');
    this.isRecord = false;
    this.isPaused = true;
    if (this.recordingStarted) {
      this.timerShouldStart = false;
      this.audio.pauseRecord();
      this.recordingStarted = false;
    }
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
