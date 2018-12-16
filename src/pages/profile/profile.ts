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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User,
    public modalCtrl: ModalController) {
    this.user.getUser().subscribe((resp) => {
      console.log(resp);
      this.userInfo = resp;
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  editUserInfo() {
    let editModal = this.modalCtrl.create('UserInfoPage', {userInfo: this.userInfo.user});
    editModal.onDidDismiss(userInfo => {
      if (userInfo) {
        // this.items.add(item);
        // this.ngOnInit();
      }
    })
    editModal.present();
  }

}
