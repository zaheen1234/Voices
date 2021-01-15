import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-confirmation',
  templateUrl: './cancel-confirmation.page.html',
  styleUrls: ['./cancel-confirmation.page.scss'],
})
export class CancelConfirmationPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  backToQuestionScreen() {
    this.route.navigate(['/home']);
    
    // this.route.navigate(['/root']);
  }

}
