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
  netHours = 0;
  netMinutes = 0;
  progressForProgressBar: number = 0;
  playSimple: boolean = true;


  ngOnInit() {
    this.questionService.setLastRouteFunction('list');

    this.questionsList = this.questionService.questionsList;

  }



  // ionViewWDidLeave() {
  //   this.questionService.setLastRouteFunction('list');
  // }

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
      this.audio.release();
      this.audioList = [];
    }


  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.audioList = JSON.parse(localStorage.getItem("audiolist"));
  }

  resetProgressBar() {
    this.progress = 0;

  }

  specialPlay(index) {

    if (this.playSimple) {
      this.universalID = -99999;
      return;
    }
    if (this.isIDAlreadySet) {
      // do nothing
    } else {
      this.universalID = index;
      this.previousID = index;
      this.isIDAlreadySet = true;
      this.changeRef.detectChanges();
    }
    this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.audioList[index].filename;
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.isPlaying = true;
    this.showPause = true;
    this.showPlay = false;
  
    this.changeRef.detectChanges();
    this.audio.onStatusUpdate.subscribe((statusCode) => {
      if (statusCode === 4) {
        if (this.audioList[index].nextPeer) {
         
          let newIndex = index + 1;
          this.specialPlay(newIndex);
        }
        else {
          this.isPlaying = false;
          this.currentNumber = -111111;
          this.previousID = -999999;
          this.universalID = -9999;
          this.isIDAlreadySet = false;
          this.audio.release();
          this.startTimer = false;
          this.pauseTimer = false;
          this.showPlay = true;
          this.showPause = false;
          this.isAudioPaused = false;
          this.changeRef.detectChanges();
          this.progress = 0;
          this.p_bar_value = 0;
        }

      }
    });
  }
  playAudioS(id, fromWhere) {
    this.vibration.vibrate(100);
    this.playAudio(id, fromWhere);
  }

  playAudio(id, fromWhere) {

    if (this.isPlaying) {
      this.playSimple = true;
      this.audio.stop();
      this.universalID = -99999;
      this.isPlaying = false;
      this.startTimer = false;
      this.pauseTimer = false;
      this.startProgressBarTimer();
      return;
    }

    if (this.isAudioPaused) {
      if (this.previousID == id) {
        this.audio.play();
        this.showPause = true;
        this.showPlay = false;
        this.isAudioPaused = false;
        this.currentNumber = id;
        this.isPlaying = true;
        this.pauseTimer = false;
        this.startTimer = true;
        this.startProgressBarTimer();
        this.changeRef.detectChanges();
      } else {

        if (this.audioList[id].nextPeer) {
          this.playSimple = false;
          this.progressForProgressBar = 0;
          this.progress = 0;
          this.p_bar_value = 0;
          this.totalSeconds = this.audioList[id].totalSeconds;
          this.isIDAlreadySet = false;
          this.specialPlay(id);
          this.pauseTimer = false;
          this.startTimer = true;
          this.startProgressBarTimer();
          return;
        } else {
          this.universalID = id;
          this.playSimple = true;
          this.currentNumber = id;
          this.previousID = id;
          this.changeRef.detectChanges();
          this.progressForProgressBar = 0;
          this.progress = 0;
          this.p_bar_value = 0;
          this.totalSeconds = this.audioList[id].totalSeconds;
          this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.audioList[id].filename;
          this.audio = this.media.create(this.filePath);
          this.audio.play();

          this.isPlaying = true;

          this.showPause = true;
          this.showPlay = false;
          this.pauseTimer = false;
          this.startTimer = true;
          this.startProgressBarTimer();

          this.audio.onStatusUpdate.subscribe((statusCode) => {
            if (statusCode === 4) {
              this.isPlaying = false;
              this.currentNumber = -111111;
              this.previousID = -999999;
              this.universalID = -9999;
              this.isIDAlreadySet = false;
              this.audio.release();
              this.startTimer = false;
              this.pauseTimer = false;
              this.showPlay = true;
              this.showPause = false;
              this.isAudioPaused = false;
              this.changeRef.detectChanges();
        
            }
          });
        }

      }
      return;

    } else {
      if (this.audioList[id].nextPeer) {
        this.playSimple = false;
      
        this.totalSeconds = this.audioList[id].totalSeconds;
        this.isIDAlreadySet = false;
        this.specialPlay(id);
        this.pauseTimer = false;
        this.startTimer = true;
        this.startProgressBarTimer();
        return;
      } else {
        this.universalID = id;
        this.playSimple = true;
        this.currentNumber = id;
        this.previousID = id;
        this.changeRef.detectChanges();
      
        this.totalSeconds = this.audioList[id].totalSeconds;
        this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.audioList[id].filename;
        this.audio = this.media.create(this.filePath);
        this.audio.play();
        this.isPlaying = true;
        this.showPause = true;
        this.showPlay = false;
        this.pauseTimer = false;
        this.startTimer = true;
        this.startProgressBarTimer();
        this.audio.onStatusUpdate.subscribe((statusCode) => {
          if (statusCode === 4) {
            this.isPlaying = false;
            this.currentNumber = -111111;
            this.previousID = -999999;
            this.universalID = -9999;
            this.isIDAlreadySet = false;
            this.audio.release();
            this.startTimer = false;
            this.pauseTimer = false;
            this.showPlay = true;
            this.showPause = false;
            this.isAudioPaused = false;
            this.changeRef.detectChanges();
      
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
    this.vibration.vibrate(100);
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
        this.progressForProgressBar = this.progressForProgressBar + 1;
        this.progress = this.progress + 1;
        let apc = (this.progressForProgressBar / this.totalSeconds)
        this.p_bar_value = apc / 10;
        this.actualSlider = Math.floor(this.progress / 10);
        if (this.actualSlider > 59) {
          // alert(this.netProgress);
          this.progress = 0;
          this.actualSlider = 0;
          this.netMinutes = this.netMinutes + 1;
        }

        if (this.netMinutes > 59) {
          this.netMinutes = 0;
          this.netHours = this.netHours + 1;
        }
        if (this.actualSlider >= this.totalSeconds) {
          this.actualSlider = this.totalSeconds;
        }

        this.changeRef.detectChanges();
        this.startProgressBarTimer();
      }, 100);
    } else if (this.pauseTimer) {
      this.progressForProgressBar = this.progressForProgressBar;
      this.progress = this.progress;
      this.p_bar_value = this.p_bar_value;
      this.actualSlider = this.actualSlider
    }
    else {
      this.progressForProgressBar = 0;
      this.progress = 0;
      this.actualSlider = 0;
      this.p_bar_value = 0;
      this.netHours = 0;
      this.netMinutes = 0;
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
