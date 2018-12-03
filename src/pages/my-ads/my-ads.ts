import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, User } from '../../providers';
import { Storage } from '@ionic/storage';
import { MainPage } from '../';

/**
 * Generated class for the MyAdsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-ads',
  templateUrl: 'my-ads.html',
})
export class MyAdsPage {
  currentItems: any = [];
  isDataAvailable: boolean = false;
  scrollLock: boolean = false;
  constructor(public navCtrl: NavController, public user: User,
    public items: Items, public modalCtrl: ModalController,
    public storage: Storage, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAdsPage');
  }

  ngOnInit() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...'
    });
    loading.present();
    this.items.getMyAds({offset: 0}).subscribe((resp) => {
      loading.dismiss();
      this.isDataAvailable = true;
      this.currentItems = resp; 
    }, (err) => {
      if (err.error === 'Unauthorized') {
        this.user.logout();
        this.navCtrl.setRoot('LoginPage');
      }
      console.log(err);
      loading.dismiss();
    });
  }
  
  ionViewDidEnter() {
  }

  ionViewCanEnter(): any {
    // here we can either return true or false
    // depending on if we want to leave this view
    return new Promise((resolve, reject) => {
      return this.storage.get('_token').then((value) => {
        if (value) {
          return resolve();
        } else {
          return reject();
        }
      });
    });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        // this.items.add(item);
        this.ngOnInit();
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  doInfinite(infiniteScroll) {
    if (!this.scrollLock) {
      this.scrollLock = true;
      this.items.getMyAds({offset: this.currentItems.length}).subscribe((resp) => {
        this.isDataAvailable = true;
        this.currentItems = this.currentItems.concat(resp); 
        infiniteScroll.complete();
        this.scrollLock = false;
      }, (err) => {
        console.log(err);
        infiniteScroll.complete();
      });
    }
  }
}
