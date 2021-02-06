import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordAnswerPageRoutingModule } from './record-answer-routing.module';

import { RecordAnswerPage } from './record-answer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordAnswerPageRoutingModule
  ],
  declarations: [RecordAnswerPage]
})
export class RecordAnswerPageModule {}
