import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Items } from '../../providers';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  categories: any;
  subcategories: any;
  form: FormGroup;
  public editorValue: string = '';
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera,
    public items: Items, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private sanitizer: DomSanitizer) {
    this.form = formBuilder.group({
      images: [[]],
      title: ['', Validators.required],
      pickup: ['', Validators.required],
      drop: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      amount: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Please Wait...'
    });
    loading.present();
    this.items.getMetaData().subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      console.log(resp);
      this.categories = resp;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      let alert = this.alertCtrl.create({
        title: 'Sonthing went wrong, Please try again.',
        subTitle: err.error,
        buttons: [{
          text: 'OK',
          handler: () => {
            loading.dismiss();
            this.viewCtrl.dismiss(this.form.value);
          }
        }]
      });
      alert.present();
    });
  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
      this.form.value.images.push('data:image/jpg;base64,' + data);
      // this.form.patchValue({ 'image': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;

      this.form.value.images.push(imageData);
      // this.form.patchValue({ 'image': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getSubcatsById(event) {
    this.subcategories = event.Subcategories;
  }

  getProfileImageStyle(image) {
    return 'url(' + image + ')'
  }

  getImgContent(image) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (this.form.value.images.length < 1) {
      let alert = this.alertCtrl.create({
        title: 'Form incomplete',
        subTitle: 'Please select atleast one image.',
        buttons: [{
          text: 'OK'
        }]
      });
      alert.present();
      return false;
    }
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creating Ad Please Wait...'
    });
    loading.present();
    this.form.value.catId = this.form.value.category.id;
    this.form.value.subcatId = this.form.value.subcategory.id;
    this.items.createAd(this.form.value).subscribe((resp) => {
      // this.navCtrl.push(MainPage);
      console.log(resp);
      if (!this.form.valid) { return; }
      loading.dismiss();
      this.viewCtrl.dismiss(this.form.value);
    }, (err) => {
      console.log(err);
      let alert = this.alertCtrl.create({
        title: 'Not Allowed',
        subTitle: err.error,
        buttons: [{
          text: 'OK',
          handler: () => {
            loading.dismiss();
            this.viewCtrl.dismiss(this.form.value);
          }
        }]
      });
      alert.present();
    });
  }
}
