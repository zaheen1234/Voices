import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
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
     private questionService: QuestionServiceService, private vibration: Vibration
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
  ngOnInit() {
    this.question = this.questionService.getCurrentQuestion();
    console.log('init called');
    this.enable5 = true;
    this.startTimerFirst();
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
    this.startInterval();
    // setTimeout(() => {
    //   this.started = false;
    //   this.animation = true;
    //   this.startRecord();
    // }, 1000);
    
  //   setInterval(function () {
  //     // get media amplitude
  //     this.audio.getCurrentAmplitude(
  //         // success callback
  //         function (amp) {
  //             console.log(amp + "% AMPLITUDE");
  //         },
  //         // error callback
  //         function (e) {
  //             console.log("Error getting amp=" + e);
  //         }
  //     );
  // }, 1000);
    // this.audio.getCurrentAmplitude().then((data)=> {
    //   console.log('AMPLITUDE : ' , data);
    // })
    this.recording = true;
    }


    startInterval() {
      console.log('startInterval called');
      const self = this;
      this.interval = setInterval(_ => {
      self.progress = self.progress + 1;
      console.log('progress');
      this.audio.getCurrentAmplitude().then((data)=> {
      console.log('AMPLITUDE : ' , data);
      if (data > 0.5) {
        console.log('UseR IS SPEAKING');
        this.showPlain = false;
        this.showGif = true;
        this.changeRef.detectChanges();
      } else {
        console.log('user IS SILENT');
        this.showGif = false;
        this.showPlain = true;
        this.changeRef.detectChanges();
      }
    })
      }, 1000);
    }

    stopInterval() {
      this.showGif = false;
      this.showPlain = true;
      clearInterval(this.interval);
      console.log('stop enterval called');
    }

  stopRecord() {
    this.stopInterval();
    this.vibration.vibrate(100);
    this.audio.stopRecord();
    this.audio.release();
    let data = { filename: this.fileName, question: this.question.question, id: this.question.id };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
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


  goToCancelScreen() {
   this.vibration.vibrate(100);
   console.log('gotocancelScreen function called');
   this.cancelModeEnable = true;
   this.cancelModeDisable = false;
   this.changeRef.detectChanges();
  }

  resumeRecording() {
    this.vibration.vibrate(100);
    this.isRecord = true;
    this.isPaused = false;
    this.audio.resumeRecord();
  }

  saveRecording() {
    this.stopRecord();
    this.route.navigate(['/success-page']);
  }

  pauseRecording() {
    this.vibration.vibrate(100);
    console.log('funct called');
    this.isRecord = false;
    this.isPaused = true;
    this.audio.pauseRecord();

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
