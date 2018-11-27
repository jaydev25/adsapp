import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  Slides} from 'ionic-angular';

import { Items } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  viewId: any;
  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items) {
    this.item = navParams.get('item');
  }

  ionViewDidEnter() {
    console.log(this.item);
    if (!this.item) {
      return this.navCtrl.setRoot(MainPage);
    }
    this.items.viewAd({
      adId: this.item.id,
      statType: 'view'
    }).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      this.viewId = resp['id'];
      console.log(this.viewId);
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLeave() {
    console.log(this.viewId);
    if (this.viewId) {
      this.items.updateView(this.viewId).subscribe((resp) => {
        // this.navCtrl.push(MainPage);
        console.log(resp);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
