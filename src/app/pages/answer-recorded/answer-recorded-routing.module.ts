import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerRecordedPage } from './answer-recorded.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerRecordedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerRecordedPageRoutingModule {}
