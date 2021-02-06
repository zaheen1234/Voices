import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordingsListPage } from './recordings-list.page';

const routes: Routes = [
  {
    path: '',
    component: RecordingsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordingsListPageRoutingModule {}
