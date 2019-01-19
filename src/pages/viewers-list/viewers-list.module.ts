import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewersListPage } from './viewers-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ViewersListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewersListPage),
    PipesModule
  ],
})
export class ViewersListPageModule {}
