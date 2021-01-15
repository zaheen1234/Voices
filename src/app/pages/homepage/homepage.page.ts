import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {

  constructor( private route: Router) { }

  ngOnInit() {
  }


  openRecordingsList() {
    this.route.navigate(['/recordings-list'])
  }
}
