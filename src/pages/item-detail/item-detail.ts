import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Slides, AlertController, LoadingController} from 'ionic-angular';

import { Items } from '../../providers';
import { MainPage } from '../';
import * as _ from 'lodash';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  @ViewChild('chartCanvas') chartCanvas;

  item: any;
  isView: any;
  viewId: any;
  viewers: any = [];
  viewUsers: any = [];
  viewTime: any;
  views: any = [];
  chartVar: any;
  constructor(public navCtrl: NavController, navParams: NavParams, public items: Items, private alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
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
      }).subscribe((resp: any) => {
        this.viewers = resp.ad.viewers;
        this.viewUsers = resp.ad.viewUsers;
        // this.navCtrl.push(MainPage);
        this.viewId = resp.data.id;
        console.log(this.viewId);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.items.viewMyAd({
        adId: this.item.id,
        statType: 'view'
      }).subscribe((resp: any) => {
        this.views = resp.allViews;
        this.viewUsers = resp.ad.viewUsers;
        console.log(_.filter(this.views, function(o) { if (o.duration < 0 && o.duration >=5) return o }).length);
        this.chartVar = new Chart(this.chartCanvas.nativeElement, {
          type: 'bar',
          data: {
            datasets: [{
              label: 'Y - Views, X - Duration',
              data: [
                _.filter(this.views, function(o) { if (o.duration > 0 && o.duration <=5) return o }).length,
                _.filter(this.views, function(o) { if (o.duration > 5 && o.duration <=10) return o }).length,
                _.filter(this.views, function(o) { if (o.duration > 10 && o.duration <=15) return o }).length,
                _.filter(this.views, function(o) { if (o.duration > 15 && o.duration <=20) return o }).length,
                _.filter(this.views, function(o) { if (o.duration > 20 && o.duration <=25) return o }).length,
                _.filter(this.views, function(o) { if (o.duration > 25) return o }).length
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132, 2)',
                'rgba(54,  162, 235, 2)',
                'rgba(255, 206, 86, 2)',
                'rgba(75, 192, 192, 2)',
                'rgba(153, 102, 255, 2)',
                'rgba(255, 159, 64, 2)'
              ],
              borderWidth: 1
            }],
            labels: [
              '< 5',
              '< 10',
              '< 15',
              '< 20',
              '< 25',
              '> 30',
            ]
          },
    
          options: {
            legend: {
              display: true
            },
            tooltips: {
              enabled: true
            }
          }

          // options: {
          //   scales: {
          //       yAxes: [{
          //           ticks: {
          //               beginAtZero:true
          //           }
          //       }]
          //   }
          // }
    
        })
        // this.navCtrl.push(MainPage);
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

  openViewers() {
    let profileModal = this.modalCtrl.create('ViewersListPage', { viewers: this.viewUsers });
    profileModal.present();
  }
}
