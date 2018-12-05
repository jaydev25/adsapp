import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  Slides, AlertController, LoadingController} from 'ionic-angular';

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
  isView: any;
  viewId: any;
  viewers: any = [];
  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    this.item = navParams.get('item');
    this.isView = navParams.get('isView');
    if (this.item) {
      // this.viewers = _.groupBy(this.item.AdsStats, 'createdBy');
      // _.forEach(_.groupBy(this.item.AdsStats, 'createdBy'), (element, key) => {
      //   element.duration = _.sumBy(element, function(o) {
      //     const createdAt = new Date(o.createdAt);
      //     const updatedAt = new Date(o.updatedAt);
      //     var seconds = (updatedAt.getTime() - createdAt.getTime()) / 1000;
      //     return seconds;
      //   });
      //   this.viewers.push({
      //     user: key,
      //     duration: element.duration
      //   })
      // });
      // this.viewers = _.map(_.uniqBy(this.item.AdsStats, 'createdBy'), 'createdBy');
      if (this.item.viewers) {
        this.viewers = this.item.viewers;
      }
    }
    
  }

  ionViewDidEnter() {
    console.log(this.item);
    if (!this.item) {
      return this.navCtrl.setRoot(MainPage);
    }
    if (this.isView) {
      this.items.viewAd({
        adId: this.item.id,
        statType: 'view'
      }).subscribe((resp) => {
        this.viewers = resp['viewers'];
        // this.navCtrl.push(MainPage);
        this.viewId = resp['data']['id'];
        console.log(this.viewId);
      }, (err) => {
        console.log(err);
      });
    }
  }

  deleteAd(item) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait...'
    });
    let alert = this.alertCtrl.create({
      title: 'Delete Ad',
      subTitle: 'Are you sure you want to delete this ad?',
      buttons: [{
        text: 'OK',
        handler: () => {
          loading.present();
          this.items.deleteAd(item).subscribe((resp) => {
            console.log(resp);
            this.navCtrl.setRoot('MyAdsPage');
            loading.dismiss();
          }, (err) => {
            console.log(err);
            loading.dismiss();
          });
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          loading.dismiss();
        }
      },]
    });
    alert.present();
  }

  ionViewDidLeave() {
    if (this.viewId && this.isView) {
      this.items.updateView(this.viewId).subscribe((resp) => {
        // this.navCtrl.push(MainPage);
        console.log(resp);
      }, (err) => {
        console.log(err);
      });
    }
  }
}
