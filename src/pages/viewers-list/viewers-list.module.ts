import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewersListPage } from './viewers-list';

@NgModule({
  declarations: [
    ViewersListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewersListPage),
  ],
})
export class ViewersListPageModule {}
