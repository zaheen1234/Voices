import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionServiceService } from '../../services/questionService/question-service.service';

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.page.html',
  styleUrls: ['./recordings-list.page.scss'],
})
export class RecordingsListPage implements OnInit {

  constructor(private route: Router, private questionService: QuestionServiceService) { }

  questionsList = [];

  ngOnInit() {
    this.questionsList = this.questionService.questionArray;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
  }


}
