import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { identifierModuleUrl } from '@angular/compiler';



@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.page.html',
  styleUrls: ['./recordings-list.page.scss'],
})
export class RecordingsListPage implements OnInit {

  constructor(private route: Router, private questionService: QuestionServiceService,
    private platform: Platform, private media: Media, private file: File,
    private changeRef: ChangeDetectorRef, private vibration: Vibration) {

    this.platform.pause.subscribe(() => {
      this.appIsPaused();
    });

    this.platform.resume.subscribe(() => {
      this.appIsResume();
    });
  }

  questionsList = [];
  audioList = [];
  filePath: string;
  fileName: string;
  audio: MediaObject;
  currentNumber;
  isPlaying: boolean = false;
  progress = 0;
  startTimer: boolean = false;
  pauseTimer: boolean = false;
  totalSeconds = 0;
  p_bar_value: number = 0;

  showPause: boolean = false;
  showPlay: boolean = true;
  isAudioPaused: boolean = false;
  previousID: number = 99999;
  universalID: number = -9999;
  isIDAlreadySet: boolean = false;
  actualSlider = 0;


  ngOnInit() {
    this.questionsList = this.questionService.questionArray;
  }

  appIsPaused() {
    if (this.isPlaying) {
      this.audio.pause();
    }

  }

  appIsResume() {
    if (this.isPlaying) {
      this.audio.play();
    }
  }

  ionViewWillLeave() {
    if (this.isPlaying) {
      this.audio.stop();
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.audioList = JSON.parse(localStorage.getItem("audiolist"));
  }

  resetProgressBar() {
    this.progress = 0;
  }

  playNewAudio(index, id) {

 
    let completeFile = this.audioList[id];
    this.currentNumber = index;
    this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + completeFile.filename;
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.audio.onStatusUpdate.subscribe((statusCode) => {
      if (statusCode === 4) {
        if (completeFile.nextPeer) {
          let newIndex = id + 1;
          this.playNewAudio(index, newIndex);
        } else {
          this.currentNumber = -99999;
        }
      }


    });

  }


  playAudio(id, fromWhere) {
    
    let completeFile = this.audioList[id];
    if (fromWhere === 'html') {
      this.vibration.vibrate(100);
        }

    if (this.isPlaying && fromWhere === 'html') {
        this.pauseAudio();
      // this.audio.stop();
      // this.isPlaying = false;
      // this.startTimer = false;
      // this.pauseTimer = false;
      // this.startProgressBarTimer();
      return;
    }
    this.previousID == id;
    if (fromWhere === 'html') {
      if (this.isIDAlreadySet && this.previousID == id) {
        // do nothing
      } else {
        this.universalID = id;
        this.previousID == id
        this.isIDAlreadySet = true;
      }
      } else {
        if (this.isIDAlreadySet) {
          // do nothing
        } else {
          this.universalID = id;
          this.isIDAlreadySet = true;
        }
    }
    if (this.isAudioPaused) {  // if audio is paused
      if (this.previousID == id) { // audio is paused and current id is matching with previous id
        this.audio.play();  // we will simply play the audio again
        this.showPause = true;
        this.showPlay = false;
        this.isAudioPaused = false;
        this.currentNumber = id;
        this.isPlaying = true;
        this.pauseTimer = false;
        this.startTimer = true;
        this.startProgressBarTimer();
        this.changeRef.detectChanges();
      } else {  // means new file is selected to play audio and previous audio is paused
        this.currentNumber = id;
        this.previousID = id;
        this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + completeFile.filename;
        this.audio = this.media.create(this.filePath);
        this.audio.play();
        this.showPause = true;
        this.showPlay = false;
        // adding code to reset progress timer start
        if (fromWhere === 'html') {
          this.progress = 0;
          this.p_bar_value = 0;  
          this.totalSeconds = completeFile.totalSeconds;
        }
        // adding code end
        this.isAudioPaused = false;
        this.pauseTimer = false;
        // this.totalSeconds = completeFile.totalSeconds;
        this.startTimer = true;
        this.startProgressBarTimer();
        this.isPlaying = true;
        this.audio.setVolume(0.8);
        this.changeRef.detectChanges();
        this.audio.onStatusUpdate.subscribe((statusCode) => {
          if (statusCode === 4) {
            if (completeFile.nextPeer) {
              // this.startTimer = false;
              // this.pauseTimer = true;
              let newIndex = id + 1;
              // this.isPlaying = false;
              
              this.playAudio(newIndex, 'system');
            }
            else {
              console.log('Audio FINISHED playing');
              this.isPlaying = false;
              this.currentNumber = -111111;
              this.universalID = -9999;
              this.isIDAlreadySet = false;
              this.audio.release();
              this.startTimer = false;
              this.showPlay = true;
              this.showPause = false;
              this.isAudioPaused = false;
              this.pauseTimer = false;
              this.changeRef.detectChanges();
              this.progress = 0;
              this.p_bar_value = 0;
            }

          }
        });
      }
    } else {   // if audio is not paused
      if (this.previousID == id) {
        this.audio.play();
        this.showPause = true;
        this.isPlaying = true;
        this.showPlay = false;
        this.currentNumber = id;
        this.isAudioPaused = false;
       if (fromWhere === 'html') {
        this.startTimer = true;
        this.pauseTimer = false;
        this.startProgressBarTimer();
       }
        this.changeRef.detectChanges();
      } else {
        // alert('audio is not paused and ids dont match, id : ' + id);

        this.currentNumber = id;
        this.previousID = id;

        this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + completeFile.filename;
        this.audio = this.media.create(this.filePath);
        this.audio.play();
        this.showPause = true;
        this.showPlay = false;
        this.isAudioPaused = false;
        this.changeRef.detectChanges();
        if (fromWhere === 'html') {
          this.progress = 0;
          this.p_bar_value = 0;
          this.totalSeconds = completeFile.totalSeconds;  
        }
        // this.totalSeconds = completeFile.totalSeconds;
        if (fromWhere === 'html') {
          this.startTimer = true;
        this.pauseTimer = false;
        this.startProgressBarTimer();
       
        }
        this.isPlaying = true;
        this.audio.setVolume(0.8);
        this.changeRef.detectChanges();
        this.audio.onStatusUpdate.subscribe((statusCode) => {
          if (statusCode === 4) {

            if (completeFile.nextPeer) {
              // this.startTimer = false;
              // this.pauseTimer = true;
              // this.isPlaying = false;
              let newIndex = id + 1;
              this.playAudio(newIndex, 'system');
            }
            else {

              console.log('Audio FINISHED playing');
              this.isPlaying = false;
              this.currentNumber = -111111;
              this.universalID = -9999;
              this.isIDAlreadySet = false;
              this.audio.release();
              this.isAudioPaused = false;
              this.showPlay = true
              this.showPause = false;
              this.startTimer = false;
              this.pauseTimer = false;
              this.changeRef.detectChanges();
              this.progress = 0;
              this.p_bar_value = 0;
            }
          }
        });
      }
    }

  }

  getExactData(file) {

    this.audioList.forEach(element => {
      if (element.filename === file) {
        return element;
      }
    });

    return file
  }

  pauseAudio() {
    this.audio.pause();
    this.startTimer = false;
    this.pauseTimer = true;
    this.startProgressBarTimer();
    this.isAudioPaused = true;
    this.isPlaying = false;
    this.showPause = false;
    this.showPlay = true;
    this.changeRef.detectChanges();
  }

  startProgressBarTimer() {
    if (this.startTimer) {
      setTimeout(() => {
        this.progress = this.progress + 1;
        let apc = (this.progress / this.totalSeconds)

        console.log(apc);
        this.p_bar_value = apc / 10;
        this.actualSlider = Math.floor(this.progress / 10);
        this.changeRef.detectChanges();
        this.startProgressBarTimer();
      }, 100);
    } else if (this.pauseTimer) {
      this.progress = this.progress;
      this.p_bar_value = this.p_bar_value;
      this.actualSlider = this.actualSlider
    }
    else {
      this.progress = 0;
      this.actualSlider = 0;
      this.p_bar_value = 0;
    }
  }

  playAudioRecording(file) {
    let completePath = this.filePath.concat(file);
    //this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
    this.audio = this.media.create(completePath);
    this.audio.play();
    this.audio.setVolume(0.8);

  }

  getFormattedHour(hour) {
    let str1 = JSON.stringify(hour);
    if (str1.length === 1) {
      const str2 = '0';
      return str2.concat(str1);
    } else if (str1.length === 2) {
      return str1;
    }
  }

  getFormattedMinute(hour) {
    let str1 = JSON.stringify(hour);
    if (str1.length === 1) {
      const str2 = '0';
      return str2.concat(str1);
    } else if (str1.length === 2) {
      return str1;
    }
  }

  getFormattedSecond(hour) {
    let str1 = JSON.stringify(hour);
    if (str1.length === 1) {
      const str2 = '0';
      return str2.concat(str1);
    } else if (str1.length === 2) {
      return str1;
    }
  }


  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
  }
  checkIfRowEnable(number) {
    if (number === this.universalID) {
      return true;
    } else {
      return false;
    }
    this.changeRef.detectChanges();
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);
  }

  getFormattedMonth(month) {
    if (month === 1) {
      return 'Jan';
    } else if (month === 2) {
      return 'Feb';
    } else if (month === 3) {
      return 'Mar';
    } else if (month === 4) {
      return 'Apr';
    } else if (month === 5) {
      return 'May';
    } else if (month === 6) {
      return 'Jun';
    } else if (month === 7) {
      return 'Jul';
    } else if (month === 8) {
      return 'Aug';
    } else if (month === 9) {
      return 'Sep';
    } else if (month === 10) {
      return 'Oct';
    } else if (month === 11) {
      return 'Nov';
    } else if (month === 12) {
      return 'Dec';
    }
  }

}
