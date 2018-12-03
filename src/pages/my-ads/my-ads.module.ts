import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MyAdsPage } from './my-ads';

@NgModule({
  declarations: [
    MyAdsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAdsPage),
    TranslateModule.forChild()
  ],
  exports: [
    MyAdsPage
  ]
})
export class MyAdsPageModule {}
