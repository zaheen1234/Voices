import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordAnswerPage } from './record-answer.page';

const routes: Routes = [
  {
    path: '',
    component: RecordAnswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordAnswerPageRoutingModule {}
