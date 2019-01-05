import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userInfo: any;
  userDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User,
    public modalCtrl: ModalController) {
    this.user.getUser().subscribe((resp: any) => {
      console.log(resp);
      this.userInfo = resp.user;
      if (resp.user.Publisher) {
        this.userDetails = resp.user.Publisher;
      } else {
        this.userDetails = resp.user.Subscriber;
      }
    }, (err) => {
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
