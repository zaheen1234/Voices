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
    this.recording = true;
    }

  stopRecord() {
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

// adding functionality for audio recording

// record() {
//   let audioObject: MediaObject = this.media.create(this.fileName);
//   alert('file created');
//   audioObject.startRecord();
//   alert('recording started');
//   console.log('cache dir: ' + this.file.cacheDirectory);
//   console.log('start recording' + this.fileName);
//   setTimeout(() => {
//     audioObject.stopRecord();
//     console.log('duration: ' + audioObject.getDuration());
//     audioObject.release();
//     console.log('done recording' + this.fileName);
//     this.playRecording();
//     /** Do something with the record file and then delete */
//     // this.file.removeFile(this.file.tempDirectory, 'record.m4a');
//   }, 5000);
// }

// startRecording() {
//   this.platform.ready().then(() => {
//     if (!this.platform.is('cordova')) {
//       alert('platform iscordova');
//       return false;
//     }

//     if (this.platform.is('ios')) {
//       alert('platform is ios');
//       this.fileName = this.file.documentsDirectory.replace(/file:\/\//g, '') + 'record.m4a';
//     }
//     else if (this.platform.is('android')) {
//       alert('platform is android');

//       this.fileName = this.file.externalDataDirectory + 'record.3gp';
//       this.record();
//     }
//     else {
//       // future usage for more platform support
//       return false;
//     }
//   });


//   return;
//  // const file: MediaObject = this.media.create('path/to/file.mp3');
//  // this.file.checkDir(this.file.applicationStorageDirectory, 'mydir').then((any => alert('directory exists')).catch(err => alert('Directory does not exists'))
//   alert('startRecording function called');
//   let initialFile = this.file.externalRootDirectory;
//   // let slash = '/';
//   let folderName = 'Voices';

//   // let initialPlusSlash = initialFile.concat(slash);
//   let finalPathToFile = initialFile.concat(folderName);

// //   const file: MediaObject = this.media.create(finalPathToFile);
// //   file.startRecord();
// // setTimeout(() => {
// //   file.stopRecord();
// // }, 2000);
// //   //this.file.checkDir(this.file.applicationStorageDirectory, 'mydir').then(_ => alert('Directory exists')).catch(err => alert('Directory doesn\'t exist'));



//   // this.file.checkDir(this.file.externalRootDirectory, 'Voices').then(_ => alert('Directory exists')
//   // ).catch(err => alert('Directory doesn\'t exist')
//   // );
//   alert('path to file' + this.file.applicationStorageDirectory);
//   this.file.createFile(this.file.applicationStorageDirectory, 'record.3gp', true).then(() => {
//     alert('created file');
//     // let file : MediaObject = this.media.create(this.file.applicationStorageDirectory.replace(/^file:\/\//, '') + 'my_file.mp3');
//     let file : MediaObject = this.media.create(this.file.applicationStorageDirectory + 'record.3gp');

//     file.startRecord();
//     setTimeout(() => {
//       file.stopRecord();
//       alert('file recording stopped');
//       this.playRecording();
//     }, 2000);  
//   }).catch((err => alert('could not create file')));
// }
  // let slash = '/';
//   let folderName = 'Voices';

//   // let initialPlusSlash = initialFile.concat(slash);
//   let finalPathToFile = initialFile.concat(folderName);

// //   const file: MediaObject = this.media.create(finalPathToFile);
// //   file.startRecord();
// // setTimeout(() => {
// //   file.stopRecord();
// // }, 2000);
// //   //this.file.checkDir(this.file.applicationStorageDirectory, 'mydir').then(_ => alert('Directory exists')).catch(err => alert('Directory doesn\'t exist'));



//   // this.file.checkDir(this.file.externalRootDirectory, 'Voices').then(_ => alert('Directory exists')
//   // ).catch(err => alert('Directory doesn\'t exist')
//   // );
//   alert('path to file' + this.file.applicationStorageDirectory);
//   this.file.createFile(this.file.applicationStorageDirectory, 'record.3gp', true).then(() => {
//     alert('created file');
//     // let file : MediaObject = this.media.create(this.file.applicationStorageDirectory.replace(/^file:\/\//, '') + 'my_file.mp3');
//     let file : MediaObject = this.media.create(this.file.applicationStorageDirectory + 'record.3gp');

//     file.startRecord();
//     setTimeout(() => {
//       file.stopRecord();
//       alert('file recording stopped');
//       this.playRecording();
//     }, 2000);  
//   }).catch((err => alert('could not create file')));
// }
//   // let slash = '/';
//   let folderName = 'Voices';

//   // let initialPlusSlash = initialFile.concat(slash);
//   let finalPathToFile = initialFile.concat(folderName);

// //   const file: MediaObject = this.media.create(finalPathToFile);
// //   file.startRecord();
// // setTimeout(() => {
// //   file.stopRecord();
// // }, 2000);
// //   //this.file.checkDir(this.file.applicationStorageDirectory, 'mydir').then(_ => alert('Directory exists')).catch(err => alert('Directory doesn\'t exist'));



//   // this.file.checkDir(this.file.externalRootDirectory, 'Voices').then(_ => alert('Directory exists')
//   // ).catch(err => alert('Directory doesn\'t exist')
//   // );
//   alert('path to file' + this.file.applicationStorageDirectory);
//   this.file.createFile(this.file.applicationStorageDirectory, 'record.3gp', true).then(() => {
//     alert('created file');
//     // let file : MediaObject = this.media.create(this.file.applicationStorageDirectory.replace(/^file:\/\//, '') + 'my_file.mp3');
//     let file : MediaObject = this.media.create(this.file.applicationStorageDirectory + 'record.3gp');

//     file.startRecord();
//     setTimeout(() => {
//       file.stopRecord();
//       alert('file recording stopped');
//       this.playRecording();
//     }, 2000);  
//   }).catch((err => alert('could not create file')));
// }

playRecording() {

  let fileNames = 'record.3gp';
  let pathToRecording = this.file.applicationStorageDirectory + fileNames;

  this.file.checkFile(this.file.externalDataDirectory, fileNames).then((result) => {
  }).catch(err => {
  });
  let mediaFile : MediaObject = this.media.create(this.fileName);
  mediaFile.play();
  mediaFile.onStatusUpdate.subscribe((statusCode) => {
    if (statusCode === 4) {
    }
  });

}



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
