import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { UserInfoPage } from './user-info';

@NgModule({
  declarations: [
    UserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoPage),
    TranslateModule.forChild()
  ],
  exports: [
    UserInfoPage
  ]
})
export class UserInfoPageModule {}
