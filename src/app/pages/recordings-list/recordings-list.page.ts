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


  
    playAudio(file, id) {
      this.vibration.vibrate(100);

      if (this.isPlaying) {
        this.audio.stop();
        this.isPlaying = false;
        return;
      }
        this.currentNumber = id;
        if (this.platform.is('ios')) {
          this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
        } else if (this.platform.is('android')) {
          this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
      }
          this.audio.play();
          this.isPlaying = true;
          this.audio.setVolume(0.8); 

          this.audio.onStatusUpdate.subscribe((statusCode) => {
            if (statusCode === 4) {
              console.log('Audio FINISHED playing');
              this.isPlaying = false;
              this.currentNumber = -111111;
              this.changeRef.detectChanges();
              this.audio.release();
            }
          });
          
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

}
