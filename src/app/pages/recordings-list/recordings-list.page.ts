import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.page.html',
  styleUrls: ['./recordings-list.page.scss'],
})
export class RecordingsListPage implements OnInit {

  constructor(private route: Router, private questionService: QuestionServiceService,
    private platform: Platform) { }

  questionsList = [];
  audioList = [];

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
    console.log('checking audioList', JSON.stringify(this.audioList));
  }


}
