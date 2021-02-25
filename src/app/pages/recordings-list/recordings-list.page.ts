import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';



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
  previousID : number = 99999;
  isPaused: boolean = false;


  ngOnInit() {
    this.questionsList = this.questionService.questionArray;
  }

  appIsPaused() {
   // alert('app is paused');
   if (this.isPlaying) {
     this.audio.pause();
   }

  }

  appIsResume() {
    // alert('app is resume');
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
    //alert('checking audioList' + JSON.stringify(this.audioList));
  }

increaseProgressBar() {
  this.progress = this.progress + 1;
  this.changeRef.detectChanges();
}

resetProgressBar() {
  this.progress = 0;
}
  
    playAudio(file, id, completeData) {
      console.log('checking file : ' , file);
      this.vibration.vibrate(100);

       if (this.isPlaying) {
        this.audio.stop();
        this.isPlaying = false;
        this.startTimer = false;
        this.pauseTimer = false;
        return;
      }
      
      if(this.isAudioPaused) {  // if audio is paused
        if (this.previousID == id) { // audio is paused and current id is matching with previous id
        //  alert('audio is paused and ids matched, id : ' + id);
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

        //  alert('audio is paused and but ids dont match, id : ' + id);

          this.currentNumber = id;
          this.previousID = id;
          if (this.platform.is('ios')) {
            this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
            this.audio = this.media.create(this.filePath);
          } else if (this.platform.is('android')) {
            this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
            this.audio = this.media.create(this.filePath);
        }
            this.audio.play();

            this.showPause = true;
            this.showPlay = false;
            this.isAudioPaused = false;
            this.pauseTimer = false;
            this.totalSeconds = completeData.totalSeconds;
            // alert('checking totalSeconds : ' + this.totalSeconds);
            this.progress = 0;
            this.p_bar_value = 0;
            this.startTimer = true;
            this.startProgressBarTimer();
            this.isPlaying = true;
            this.audio.setVolume(0.8); 
            this.changeRef.detectChanges();
            this.audio.onStatusUpdate.subscribe((statusCode) => {
              if (statusCode === 4) {
                console.log('Audio FINISHED playing');
                this.isPlaying = false;
                this.currentNumber = -111111;
                this.changeRef.detectChanges();
                this.audio.release();
                this.startTimer = false;
                this.showPlay = true;
                this.showPause = false;
                this.isAudioPaused = false;
                this.pauseTimer = false;
              } 
            });
        }
      } else {   // if audio is not paused
        if (this.previousID == id) {
        //  alert('audio is not paused but ids matched, id : ' + id);
          this.audio.play();
          this.showPause = true;
          this.isPlaying = true;
          this.showPlay = false;
          this.currentNumber = id;
          this.isAudioPaused = false;
          this.pauseTimer = false;
          this.progress = 0;
            this.p_bar_value = 0;
            this.startTimer = true;
            this.startProgressBarTimer();
          this.changeRef.detectChanges();
        } else {
         // alert('audio is not paused and ids dont match, id : ' + id);

          this.currentNumber = id;
          this.previousID = id;
        if (this.platform.is('ios')) {
          this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
        } else if (this.platform.is('android')) {
          this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
      }
          this.audio.play();
          this.showPause = true;
          this.showPlay = false;
          this.isAudioPaused = false;
          this.changeRef.detectChanges();

          this.totalSeconds = completeData.totalSeconds;
          // alert('checking totalSeconds : ' + this.totalSeconds);
          this.progress = 0;
          this.p_bar_value = 0;
          this.startTimer = true;
          this.startProgressBarTimer();
          this.pauseTimer = false;
          this.isPlaying = true;
          this.audio.setVolume(0.8); 
          this.changeRef.detectChanges();
          this.audio.onStatusUpdate.subscribe((statusCode) => {
            if (statusCode === 4) {
              console.log('Audio FINISHED playing');
              this.isPlaying = false;
              this.currentNumber = -111111;
              this.audio.release();
              this.isAudioPaused = false;
              this.showPlay = true
              this.showPause = false;
              this.startTimer = false;
              this.pauseTimer = false;
              this.changeRef.detectChanges();

            } 
          });
        }
      }

      // if (this.isPlaying) {
      //   this.audio.stop();
      //   this.isPlaying = false;
      //   return;
      // }
      //   this.currentNumber = id;
      //   this.previousID = id;
      //   if (this.platform.is('ios')) {
      //     this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      //     this.audio = this.media.create(this.filePath);
      //   } else if (this.platform.is('android')) {
      //     this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
      //     this.audio = this.media.create(this.filePath);
      // }
      //     this.audio.play();
      //     this.showPause = true;
      //     this.showPlay = false;
      //     this.totalSeconds = completeData.totalSeconds;
      //     // alert('checking totalSeconds : ' + this.totalSeconds);
      //     this.startTimer = true;
      //     this.startProgressBarTimer();
      //     this.isPlaying = true;
      //     this.audio.setVolume(0.8); 
      //     this.changeRef.detectChanges();
      //     this.audio.onStatusUpdate.subscribe((statusCode) => {
      //       if (statusCode === 4) {
      //         console.log('Audio FINISHED playing');
      //         this.isPlaying = false;
      //         this.currentNumber = -111111;
      //         this.changeRef.detectChanges();
      //         this.audio.release();
      //         this.startTimer = false;
      //         this.showPause = false;
      //         this.showPlay = true;
      //       } 
      //     });
          
    }

    pauseAudio() {
      this.audio.pause();
      this.startTimer = false;
      this.pauseTimer = true;
      this.isAudioPaused = true;
      this.isPlaying = false;
      this.showPause = false;
      this.showPlay = true;
      this.changeRef.detectChanges();
    }

    startProgressBarTimer() {
      if(this.startTimer) {
        setTimeout(()=> {
          this.progress = this.progress + 1;
          let apc = (this.progress / this.totalSeconds)
          console.log(apc);
          this.p_bar_value = apc;
          this.changeRef.detectChanges();
          this.startProgressBarTimer();
        }, 1000);
      } else if(this.pauseTimer) {
        this.progress = this.progress;
        this.p_bar_value = this.p_bar_value;
      }
      else {
        this.progress = 0;
        this.p_bar_value = 0;
      }
    }

    playAudioRecording (file) {
      alert('File Exists');
      let completePath = this.filePath.concat(file);
      //this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      alert('checking complete path : ' + completePath );
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
      if (number === this.currentNumber) {
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
      }else if (month === 3) {
        return 'Mar';
      }else if (month === 4) {
        return 'Apr';
      }else if (month === 5) {
        return 'May';
      }else if (month === 6) {
        return 'Jun';
      }else if (month === 7) {
        return 'Jul';
      }else if (month === 8) {
        return 'Aug';
      }else if (month === 9) {
        return 'Sep';
      }else if (month === 10) {
        return 'Oct';
      }else if (month === 11) {
        return 'Nov';
      }else if (month === 12) {
        return 'Dec';
      }
    }

}
