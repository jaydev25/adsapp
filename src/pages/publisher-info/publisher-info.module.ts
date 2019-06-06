import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublisherInfoPage } from './publisher-info';

@NgModule({
  declarations: [
    PublisherInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PublisherInfoPage),
  ],
})
export class PublisherInfoPageModule {}
