import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'recordings-list',
    loadChildren: () => import('./pages/recordings-list/recordings-list.module').then( m => m.RecordingsListPageModule)
  },
  {
    path: 'record-answer',
    loadChildren: () => import('./pages/record-answer/record-answer.module').then( m => m.RecordAnswerPageModule)
  },
  {
    path: 'success-page',
    loadChildren: () => import('./pages/success-page/success-page.module').then( m => m.SuccessPagePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
