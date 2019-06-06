import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers';

/**
 * Generated class for the PublisherInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publisher-info',
  templateUrl: 'publisher-info.html',
})
export class PublisherInfoPage {

  userInfo: any;
  userDetails: any;
  publisherEmail: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait...'
    });
    loading.present();
    this.publisherEmail = this.navParams.get('email');
    console.log(this.publisherEmail);
    this.user.getUserByEmail(this.publisherEmail).subscribe((resp: any) => {
      if (resp.success && resp.publisherInfo && resp.publisherInfo.Publisher) {
        this.userInfo = resp.publisherInfo;
        this.userDetails = resp.publisherInfo.Publisher;
      }
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  editUserInfo() {
    let editModal = this.modalCtrl.create('UserInfoPage', {userInfo: this.userInfo});
    editModal.onDidDismiss(userInfo => {
      if (userInfo) {
        // this.items.add(item);
        // this.ngOnInit();
      }
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    })
    editModal.present();
  }

}
