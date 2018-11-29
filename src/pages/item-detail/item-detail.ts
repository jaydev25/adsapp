import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  Slides} from 'ionic-angular';

import { Items } from '../../providers';
import { MainPage } from '../';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  viewId: any;
  viewUsers: any = [];
  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items) {
    this.item = navParams.get('item');
    if (this.item) {
      // this.viewUsers = _.groupBy(this.item.AdsStats, 'createdBy');
      _.forEach(_.groupBy(this.item.AdsStats, 'createdBy'), (element, key) => {
        element.duration = _.sumBy(element, function(o) {
          const createdAt = new Date(o.createdAt);
          const updatedAt = new Date(o.updatedAt);
          var seconds = (updatedAt.getTime() - createdAt.getTime()) / 1000;
          return seconds;
        });
        this.viewUsers.push({
          user: key,
          duration: element.duration
        })
      });
      // this.viewUsers = _.map(_.uniqBy(this.item.AdsStats, 'createdBy'), 'createdBy');
      console.log(this.viewUsers);
    }
    
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
