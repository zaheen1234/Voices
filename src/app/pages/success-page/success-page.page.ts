import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';

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


  constructor(private route: Router, private changeRef: ChangeDetectorRef,
    private questionService: QuestionServiceService, 
    private platform: Platform, private media: Media, 
    private file: File) { }


  ngOnInit() {
    console.log('init called');
    this.question = this.questionService.getCurrentQuestion();
    this.recordingList = JSON.parse(localStorage.getItem("audiolist"));
  }

  nextQuestion() {
    this.questionService.increaseQuestionIndex();
    this.route.navigate(['/home']);
  }

  deleteAnswer() {
    this.deleteModeDisable = false;
    this.deleteModeEnable = true;
  }

  backToQuestionScreen() {
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
      this.audio.setVolume(0.8); 
  }


  deleteRecording(index) {

    let tempBookmark = this.recordingList.splice(index, 1);
    localStorage.setItem('audiolist', JSON.stringify(this.recordingList));
    this.route.navigate(['/home']); 
  }

  backToRecording () {
    console.log('gotorecording function called');
    this.deleteModeDisable = true;
    this.deleteModeEnable = false;
    this.changeRef.detectChanges();
  }

  goToRecordingsList() {
    this.route.navigate(['/recordings-list']);

  }
}
