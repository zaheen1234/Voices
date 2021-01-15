import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recordings-list',
  templateUrl: './recordings-list.page.html',
  styleUrls: ['./recordings-list.page.scss'],
})
export class RecordingsListPage implements OnInit {

  constructor(private route: Router) { }

  questionsList = [
    'What is your best Childhood Memory',
    'Who was your Childhood best friend',
    'What was your nick name in Childhood'
  ]

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
  }


}
