import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';


@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {

  deleteModeDisable = true;
  deleteModeEnable = false;
  question = this.questionService.getCurrentQuestion();
  recordingList = [];
  filePath: string;
  audio: MediaObject;
  canPlay: boolean = true;
  canPause: boolean = false;
  isPaused: boolean = false;


  constructor(private route: Router, private changeRef: ChangeDetectorRef,
    private questionService: QuestionServiceService, 
    private platform: Platform, private media: Media, 
    private file: File, private vibration: Vibration) { }


  ngOnInit() {
    console.log('init called');
    this.question = this.questionService.getCurrentQuestion();
    this.recordingList = JSON.parse(localStorage.getItem("audiolist"));
  }

  nextQuestion() {
    this.vibration.vibrate(100);
    this.questionService.increaseQuestionIndex();
    this.route.navigate(['/home']);
  }

  deleteAnswer() {
    this.vibration.vibrate(100);
    this.deleteModeDisable = false;
    this.deleteModeEnable = true;
  }

  backToQuestionScreen() {
    this.vibration.vibrate(100);
    this.deleteModeDisable = true;
    this.deleteModeEnable = false;
    this.changeRef.detectChanges()

    for (let i = 0; i < this.recordingList.length; i++) {
      if (this.question.id === this.recordingList[i].id) {
        this.deleteRecording(i);
        return;
      }
    }
  }

  startPlayingAnswer() {
    this.vibration.vibrate(100);
    if (this.isPaused) {
      this.canPause = true;
      this.canPlay = false;
      this.isPaused = false;
      this.audio.play();
      this.changeRef.detectChanges();
      return;
    }
    for (let i = 0; i < this.recordingList.length; i++) {
      if (this.question.id === this.recordingList[i].id) {
        let file = this.recordingList[i].filename;
        this.playAnswer(file);
        return;
      }
    }
  }

  playAnswer(file) {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
  }
      this.audio.play();
      this.canPlay = false;
      this.canPause = true;
      this.changeRef.detectChanges();
      this.audio.setVolume(0.8); 

      this.audio.onStatusUpdate.subscribe((statusCode) => {
        if (statusCode === 4) {
          console.log('Audio FINISHED playing');
          this.canPause = false;
          this.canPlay = true;
          this.isPaused = false;
          this.changeRef.detectChanges();
          this.audio.release();
        }
      });
  }

  pausePlayingAnswer() {
    this.vibration.vibrate(100);
    this.audio.pause();
    this.canPause = false;
    this.canPlay = true;
    this.isPaused = true;
    this.changeRef.detectChanges();
  }


  deleteRecording(index) {
    let tempBookmark = this.recordingList.splice(index, 1);
    localStorage.setItem('audiolist', JSON.stringify(this.recordingList));
    this.route.navigate(['/home']); 
  }

  backToRecording () {
    this.vibration.vibrate(100);
    console.log('gotorecording function called');
    this.deleteModeDisable = true;
    this.deleteModeEnable = false;
    this.changeRef.detectChanges();
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);

  }
}
