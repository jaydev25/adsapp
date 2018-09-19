import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { User, Region } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { firstName: string, lastName: string, email: string, password: string, contact: string, city: string, state: string, country: string, birthDate: Date, occupation: string } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    city: '',
    state: '',
    country: '',
    birthDate: null,
    occupation: ''
  };

  accType: string = 'Subscriber';

  countries: any[];
  states: any[];
  filteredStates: any[];

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public region: Region,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    
    this.countries = region.countries;
    this.states = region.states;

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  getStateById(id) {
    console.log(id);
    
    this.filteredStates = this.states.filter((state) => {
      return state.country_id === id; 
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
    this.user.signup(this.account).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      let alert = this.alertCtrl.create({
        title: 'Please verify your Email',
        subTitle: 'Please click on the link that we have sent you in Email to complete the registration.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot('LoginPage');
            loading.dismiss();
          }
        }]
      });
      alert.present();
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

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentLoadingText() {
  }
  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
