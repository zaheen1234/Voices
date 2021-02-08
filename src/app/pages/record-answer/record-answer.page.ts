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
  protected interval: any;
  public progress = 0;
  showGif: boolean = false;
  showPlain: boolean = true;
  recordingStarted: boolean = false;
  protected timer: any;
  public countdown = 0;
  timerShouldStart: boolean = false;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  ngOnInit() {
    this.question = this.questionService.getCurrentQuestion();
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
   // this.stopCountdown();
    this.stopInterval();
    this.audio = null;
    console.log('checking timer : ', this.countdown);
   // this.getMinutesTimer();
    let data = { filename: this.fileName, question: this.question.question, id: this.question.id ,
                 date: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear(),
                 hours: this.hours, minutes: this.minutes, seconds: this.seconds         
    };
    console.log('checking what data is going to save : ', JSON.stringify(data));
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

  startRecord() {
    this.vibration.vibrate(100);
    if (this.platform.is('ios')) {
      console.log('platform is ios');
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.M4a';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new 
      Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new 
      Date().getSeconds()+'.3gp';
      this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + 
      this.fileName;
    //  this.filePath = '/android_asset/www/assets/audio/' + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
      this.audio.startRecord();
      this.timerShouldStart = true;
      this.startCountdown();
      this.recordingStarted = true;
      this.startInterval();
      this.recording = true;
    }

    startCountdown() {
     
      if (this.timerShouldStart){
        setTimeout(() => {
          this.countdown = this.countdown + 1;
          this.startCountdown();
        }, 1000);
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
      this.audio.getCurrentAmplitude().then((data)=> {
      if (data > 0.2) {
        this.showPlain = false;
        this.showGif = true;
        this.changeRef.detectChanges();
      } else {
        this.showGif = false;
        this.showPlain = true;
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
       hour = this.countdown/3600;
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
        min = this.countdown/60;
        let roundOffOfMin: number;
        roundOffOfMin = Math.floor(min);
        console.log( 'checking min: ', roundOffOfMin);
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
    if(this.countdown > 60) {
      console.log('checking totalsecs : ', this.countdown);
      let min: number;
      min = this.countdown/60;
      let roundOffOfMin: number;
      roundOffOfMin = Math.floor(min);
      console.log( 'checking min: ', roundOffOfMin);
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

  getSeconds() {

  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
    this.timerShouldStart = false;
    this.countdown = 0;
  }

  playAudio(file,idx) {
    this.vibration.vibrate(100);
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
   // this.audio.setVolume(0.8);
  }


// playRecording() {

//   let fileNames = 'record.3gp';
//   let pathToRecording = this.file.applicationStorageDirectory + fileNames;

//   this.file.checkFile(this.file.externalDataDirectory, fileNames).then((result) => {
//   }).catch(err => {
//   });
//   let mediaFile : MediaObject = this.media.create(this.fileName);
//   mediaFile.play();
//   mediaFile.onStatusUpdate.subscribe((statusCode) => {
//     if (statusCode === 4) {
//     }
//   });

// }



// 5 timers for displaying count down before audio recording starts

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  backToQuestionScreen() {
    this.vibration.vibrate(100);
    this.cancelModeEnable = false;
    this.cancelModeDisable = true;
    this.changeRef.detectChanges()
    this.route.navigate(['/home']);
    
  }

  backToRecording () {
    this.vibration.vibrate(100);
    console.log('gotorecording function called');
    this.cancelModeEnable = false;
    this.cancelModeDisable = true;
    this.changeRef.detectChanges();
  }


  async goToCancelScreen() {
    console.log('gotocancelscreenknddknd');
   this.vibration.vibrate(100);
   const alart = await this.alertController.create({
    header: 'Alert!',
    message: '<strong>Are you sure you want to cancel your recording?</strong>',
    buttons: [
      {
        text: 'NO',
        role: 'cancel',
        handler: (blah) => {
          // do nothing
        }
      }, {
        text: 'YES',
        handler: () => {
    
        }
      },
    ]
  });
  await alart.present();
  return;
   console.log('gotocancelScreen function called');
   this.cancelModeEnable = true;
   this.cancelModeDisable = false;
   this.changeRef.detectChanges();
  }

  resumeRecording() {
    this.vibration.vibrate(100);
    this.isRecord = true;
    this.isPaused = false;
    if (this.recordingStarted === false){
      this.audio.resumeRecord();
      this.recordingStarted = true;
    }
    
  }

  saveRecording() {
   // this.stopRecord();
    this.vibration.vibrate(100);
    this.route.navigate(['/success-page']);
  }

  pauseRecording() {
    this.vibration.vibrate(100);
    console.log('funct called');
    this.isRecord = false;
    this.isPaused = true;
    if (this.recordingStarted){
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
     // this.startRecord();
    }, 1000);
  }


}
