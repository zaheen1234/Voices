import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
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
  lenOfQuestion = this.question.question.length;
  questionRange: boolean = false;
  recordingList = [];
  filePath: string;
  audio: MediaObject;
  canPlay: boolean = true;
  canPause: boolean = false;
  isPaused: boolean = false;
  questionArray = [];
  completeQuestions = [];


  constructor(private route: Router, private changeRef: ChangeDetectorRef,
    private questionService: QuestionServiceService,
    private platform: Platform, private media: Media,
    private file: File, private vibration: Vibration, 
    private alertController: AlertController) {
      this.platform.pause.subscribe(() => {
        this.appIsPaused();
      });

      this.platform.resume.subscribe(() => {
        this.appIsResume();
      });

  //     this.platform.backButton.subscribe(() => {
  //       this.backButtonHandler();
  // });


    }


  ngOnInit() {
    // this.question = this.questionService.getCurrentQuestion();
    // this.lenOfQuestion = this.question.question.length;
    // console.log('lenght of question : ', this.lenOfQuestion);
    // if (this.lenOfQuestion > 70) {
    //   this.questionRange = true;
    // } else {
    //   this.questionRange = false;
    // }
    // this.recordingList = JSON.parse(localStorage.getItem("audiolist"));

    //copying code from onlyiOS branch
    this.questionService.setLastRouteFunction('success');

    this.question = this.questionService.getCurrentQuestion();
    this.completeQuestions = this.questionService.startQuestionService();

   this.questionArray.push(this.question);
    this.lenOfQuestion = this.questionArray[0].question.length;
    if (this.lenOfQuestion > 70) {
      this.questionRange = true;
    } else {
      this.questionRange = false;
    }
   // this.recordingList = JSON.parse(localStorage.getItem("audiolist"));

    let questionsList = this.questionService.startQuestionService();

    for(let i = 0; i < questionsList.length; i ++) {
      if (this.questionArray[0].id === questionsList[i].id){
        this.completeQuestions[i].isAnswered = true;
        localStorage.setItem('questionsList', JSON.stringify(this.completeQuestions));
        this.questionService.increaseQuestionIndex();
        return;
      }
    }
  }

  appIsPaused() {
    // alert('app is paused');
    if (this.canPause) {
      this.audio.pause();
    }

   }

   backButtonHandler() {
  //  let lastRoute = this.questionService.getLastRouteFunction();
    this.route.navigate(['/home']);

  }

  //  ionViewWDidLeave() {
  //   this.questionService.setLastRouteFunction('success');
  // }

   ionViewWillLeave() {
    // alert('isCan Pause : ' + this.canPause);
    if (this.canPause) {
      this.audio.stop();
      this.audio.release();
      this.recordingList = [];
    }

   }

   ionViewWillEnter() {
    this.canPlay = true;
    this.canPause = false;
    this.recordingList = JSON.parse(localStorage.getItem("audiolist"));
   }

   appIsResume() {
     // alert('app is resume');
     if (this.canPause) {
       this.audio.play();
     }
   }

  nextQuestion() {
    this.vibration.vibrate(100);
    // this.questionService.increaseQuestionIndex();
    this.route.navigate(['/home']);
  }

  async deleteAnswer() {
    this.vibration.vibrate(100);
    // this.deleteModeEnable = true;
    // this.deleteModeDisable = false;
    // this.changeRef.detectChanges();
    const alart = await this.alertController.create({
      cssClass: 'basic-alert',
      header: 'Are you sure you want to delete your answer?',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            this.backToQuestionScreen();
          },
          cssClass: 'failure-button'
        },
        {
          text: 'NO',
          role: 'cancel',
          handler: (blah) => {
            this.backToRecording();
          },
          cssClass: 'failure-button'
        }
      ]
    });
    await alart.present();
    return;
  }

  backToQuestionScreen() {
    this.vibration.vibrate(100);
  
    for (let i = 0; i < this.recordingList.length; i++) {
      if (this.question.id === this.recordingList[i].id) {
        this.deleteRecording(i);
        this.deleteQuestion();
        return;
      }
    }
  }

  deleteQuestion() {
    let questionsList = this.questionService.startQuestionService();

    for(let i = 0; i < questionsList.length; i ++) {
      if (this.questionArray[0].id === questionsList[i].id){
        this.completeQuestions[i].isAnswered = false;
        localStorage.setItem('questionsList', JSON.stringify(this.completeQuestions));
        this.questionService.decreaseQuestionIndex();
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
        this.playAnswer(i);
        return;
      }
    }
  }

  playAnswer(index) {

      let completeFile = this.recordingList[index];
    
      this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + completeFile.filename;
      this.audio = this.media.create(this.filePath);
  
      this.audio.play();
      this.canPlay = false;
      this.canPause = true;
      this.changeRef.detectChanges();
      this.audio.setVolume(0.8);

      this.audio.onStatusUpdate.subscribe((statusCode) => {
        if (statusCode === 4) {

          if(completeFile.nextPeer) {
            let newIndex = index + 1;
            this.playAnswer(newIndex);
          } else {
            console.log('Audio FINISHED playing');
            this.canPause = false;
            this.canPlay = true;
            this.isPaused = false;
            this.changeRef.detectChanges();
            this.audio.release();
          }
       
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

  hamburger() {
    console.log('hamburger clicked');
    this.vibration.vibrate(100);
  }
  deleteRecording(index) {
    let tempBookmark = this.recordingList.splice(index, 1);
    localStorage.setItem('audiolist', JSON.stringify(this.recordingList));
    this.route.navigate(['/home']);
  }

  backToRecording () {
    this.vibration.vibrate(100);
  
  }

  goToRecordingsList() {
    this.vibration.vibrate(100);
    this.route.navigate(['/recordings-list']);

  }
}
