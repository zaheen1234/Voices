import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.page.html',
  styleUrls: ['./recordings-list.page.scss'],
})
export class RecordingsListPage implements OnInit {

  constructor(private route: Router, private questionService: QuestionServiceService,
    private platform: Platform, private media: Media, private file: File,
    private changeRef: ChangeDetectorRef) { }

  questionsList = [];
  audioList = [];
  filePath: string;
  fileName: string;
  audio: MediaObject;
  currentNumber;

  ngOnInit() {
    this.questionsList = this.questionService.questionArray;

    // let width = this.platform.width();
    // let height = this.platform.height();
    // alert('width is: '+ width);
    // alert('height is : '+ height);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.audioList = JSON.parse(localStorage.getItem("audiolist"));
    //alert('checking audioList' + JSON.stringify(this.audioList));
  }


  
    playAudio(file, id) {
  
        this.currentNumber = id;
        if (this.platform.is('ios')) {
          this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
        } else if (this.platform.is('android')) {
          this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + file;
          this.audio = this.media.create(this.filePath);
      }
          this.audio.play();
          this.audio.setVolume(0.8); 

          // setTimeout(() => {
          //   alert('audio duration : ' + this.audio.getDuration());
          // }, 1000);
          
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
  
    checkIfRowEnable(number) {
      if (number === this.currentNumber) {
        return true;
      } else {
        return false;
      }
      this.changeRef.detectChanges();
    }

    goToRecordingsList() {

      this.route.navigate(['/recordings-list']);
    }

}
