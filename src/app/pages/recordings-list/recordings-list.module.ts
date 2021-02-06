import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordingsListPageRoutingModule } from './recordings-list-routing.module';

import { RecordingsListPage } from './recordings-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordingsListPageRoutingModule
  ],
  declarations: [RecordingsListPage]
})
export class RecordingsListPageModule {}
