import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerRecordedPageRoutingModule } from './answer-recorded-routing.module';

import { AnswerRecordedPage } from './answer-recorded.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerRecordedPageRoutingModule
  ],
  declarations: [AnswerRecordedPage]
})
export class AnswerRecordedPageModule {}
