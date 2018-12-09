import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViewersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewers-list',
  templateUrl: 'viewers-list.html',
})
export class ViewersListPage {
  list: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.list = this.navParams.get('viewers');
    console.log(this.list);
    console.log('ionViewDidLoad ViewersListPage');
  }

}
