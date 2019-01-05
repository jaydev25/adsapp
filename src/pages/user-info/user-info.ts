import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { User, Region } from '../../providers';
import * as _ from 'lodash';

/**
 * Generated class for the UserInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  userInfo: any;
  countries: any[];
  states: any[];
  cities: any[];
  filteredStates: any[];
  filteredCities: any[];

  country: any;
  state: any;
  city: any;
  options : InAppBrowserOptions = {
    location: 'no',
    clearcache: 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls 
    hardwareback: 'no',
    hideurlbar: 'yes'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public user: User,
    public region: Region,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private theInAppBrowser: InAppBrowser,
    private platform: Platform) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...',
      duration: 15000
    });
    loading.present();
    this.userInfo = this.navParams.get('userInfo');
    this.region.getRegionDate().subscribe((resp) => {
      this.countries = resp['countries'];
      this.states = resp['states'];
      this.cities = resp['cities'];
      if (this.userInfo) {
        if (this.userInfo.Publisher) {
          this.userInfo.gender = this.userInfo.Publisher.gender;
          this.userInfo.address = this.userInfo.Publisher.address;
          this.userInfo.birthDate = this.userInfo.Publisher.birthDate;
          this.userInfo.city = this.userInfo.Publisher.city;
          this.userInfo.country = this.userInfo.Publisher.country;
          this.userInfo.occupation = this.userInfo.Publisher.occupation;
          this.userInfo.pincode = this.userInfo.Publisher.pincode;
          this.userInfo.state = this.userInfo.Publisher.state;
          this.userInfo.accType = 'Publisher';
          this.country = _.find(this.countries, (country) => {
            if (this.userInfo.country === country.name) {
              return true;
            }
          });
          this.getStatesById(this.country);
          this.state = _.find(this.states, (state) => {
            if (this.userInfo.state === state.name) {
              return true;
            }
          });
          this.getCitiesById(this.state);
          this.city = _.find(this.cities, (city) => {
            if (this.userInfo.city === city.name) {
              return true;
            }
          });
          loading.dismiss();
        } else if (this.userInfo.Subscriber) {
          this.userInfo.gender = this.userInfo.Subscriber.gender;
          this.userInfo.address = this.userInfo.Subscriber.address;
          this.userInfo.birthDate = this.userInfo.Subscriber.birthDate;
          this.userInfo.city = this.userInfo.Subscriber.city;
          this.userInfo.country = this.userInfo.Subscriber.country;
          this.userInfo.occupation = this.userInfo.Subscriber.occupation;
          this.userInfo.pincode = this.userInfo.Subscriber.pincode;
          this.userInfo.state = this.userInfo.Subscriber.state;
          this.userInfo.accType = 'Subscriber';
          this.country = _.find(this.countries, (country) => {
            if (this.userInfo.country === country.name) {
              return true;
            }
          });
          this.getStatesById(this.country);
          this.state = _.find(this.states, (state) => {
            if (this.userInfo.state === state.name) {
              return true;
            }
          });
          this.getCitiesById(this.state);
          this.city = _.find(this.cities, (city) => {
            if (this.userInfo.city === city.name) {
              return true;
            }
          });
          loading.dismiss();
        }
      }
    }, (err) => {
          loading.dismiss();
          console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoPage');
  }

  getStatesById(country) {
    this.filteredStates = this.states.filter((state) => {
      return state.country_id == country.id; 
    });
  }

  getCitiesById(state) {
    this.filteredCities = this.cities.filter((city) => {
      return city.state_id == state.id; 
    });
  }

  doSignup() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...',
      duration: 15000
    });
    loading.present();
    // Attempt to login in through our User service
    this.userInfo.country = this.country['name'];
    this.userInfo.state = this.state['name'];
    this.userInfo.city = this.city['name'];
    // this.account.accType = this.accType;
    this.user.updateUser(this.userInfo).subscribe((resp) => {
      if (resp['url']) {
        // this.navCtrl.push(MainPage);
        let alert = this.alertCtrl.create({
          title: 'Please verify your Email',
          subTitle: 'Please Complete the payment and then click on the link that we have sent you in Email to complete the registration as publisher.',
          buttons: [{
            text: 'OK',
            handler: () => {
              loading.dismiss();
              if (this.platform.is('mobileweb')) {
                this.openWithInAppBrowser(resp['url']);
              } else {
                this.openWithCordovaBrowser(resp['url']);
              }
              // this.navCtrl.setRoot('LoginPage');
            }
          }]
        });
        alert.present();
      } else {
        // this.navCtrl.push(MainPage);
        // let alert = this.alertCtrl.create({
        //   title: 'Please verify your Email',
        //   subTitle: 'Please click on the link that we have sent you in Email to complete the registration as subscriber.',
        //   buttons: [{
        //     text: 'OK',
        //     handler: () => {
        //       loading.dismiss();
        //       this.navCtrl.setRoot('LoginPage');
        //     }
        //   }]
        // });
        // alert.present();
      }
      
      
    }, (err) => {
      // this.navCtrl.push(MainPage);
      // this.navCtrl.setRoot(MainPage);
      loading.dismiss();
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: err && err.error ? err.error.toUpperCase() : 'Somthing went wrong please try again',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  public openWithSystemBrowser(url : string){
    let target = "_system";
    const browser = this.theInAppBrowser.create(url,target,this.options);
  }

  public openWithInAppBrowser(url : string){
    let target = "_blank";
    const browser = this.theInAppBrowser.create(url,target,this.options);
  }

  public openWithCordovaBrowser(url : string){
    let target = "_self";
    const browser = this.theInAppBrowser.create(url,target,this.options);
    browser.on('exit').subscribe(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  } 
}
