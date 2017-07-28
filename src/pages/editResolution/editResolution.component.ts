import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionSheetController, LoadingController, AlertController} from 'ionic-angular';
import {Utilities} from '../../app/utilities';
import firebase from 'firebase';
import {Camera} from 'ionic-native';

@Component({
  selector: 'page-editResolution',
  templateUrl: 'editResolution.component.html'
})
export class EditResolutionComponent {

  public base64String: string;
  loading: any;
  resolution: any;
  editResolutionForm: any;
  resolutionImageChanged = false;
  actionSheetOptions: any;
  resolutionNameOld: string;
  isRecurringOld: boolean;
  resolutionNameChanged = false;
  isRecurringChanged = false;

  constructor(public navCtrl: NavController, public utilities: Utilities, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController) {
    this.resolution = navParams.get('resolution');
    this.editResolutionForm = this.formBuilder.group({
      resolutionName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      resolutionType: [''],
      iconUrl: ['']
    });
    this.resolutionNameOld = this.resolution.name;
    this.isRecurringOld = this.resolution.isRecurring;
  }

  nameChanged() {
    if (this.resolution.name != this.resolutionNameOld) {
      this.resolutionNameChanged = true;
    } else {
      this.resolutionNameChanged = false;
    }
  }

  occuranceChanged() {
    let localIsRecurring = (this.resolution.isRecurring == "true" || this.resolution.isRecurring == true);
    if (localIsRecurring != this.isRecurringOld) {
      this.isRecurringChanged = true;
    } else {
      this.isRecurringChanged = false;
    }
  }

  changeResolutionPicture() {
    this.setActionSheetOptions();
    let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);
    actionSheet.present();
  }

  setActionSheetOptions() {
    if (this.resolution.iconUrl == "assets/images/default_resolution_256.png" || this.resolution.iconUrl == "" || this.resolution.iconUrl == undefined) {
      this.actionSheetOptions = {
        title: 'Change resolution image',
        buttons: [
          {
            text: "Camera",
            icon: "camera",
            handler: () => this.takePicture()
          },
          {
            text: 'Gallery',
            icon: "images",
            handler: () => this.getPicture()
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      };
    } else {
      this.actionSheetOptions = {
        title: 'Change resolution image',
        buttons: [
          {
            text: "Camera",
            icon: "camera",
            handler: () => this.takePicture()
          },
          {
            text: 'Gallery',
            icon: "images",
            handler: () => this.getPicture()
          },
          {
            text: 'Delete resolution image',
            role: 'destructive',
            icon: "trash",
            handler: () => this.deleteResolutionPicture()
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      };
    }
  }

  takePicture() {
    if (this.utilities.cordova) {
      let options = {
        destinationType: Camera.DestinationType.DATA_URL,
        allowEdit: true,
        quality: 100,
        targetWidth: 500,
        targetHeight: 500
      };

      this.callCamera(options);
    } else {
      let alert = this.alertCtrl.create({
        message: "Image capturing is only possible on Android or iOS",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present()
    }
  }

  getPicture() {
    if (this.utilities.cordova) {
      let options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        quality: 100,
        targetWidth: 500,
        targetHeight: 500
      };

      this.callCamera(options);
    } else {
      let alert = this.alertCtrl.create({
        message: "Image upload is only possible on Android or iOS",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present()
    }
  }

  callCamera(options) {
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64String = imageData;
        this.resolution.iconUrl = "data:image/JPEG;base64," + this.base64String;
      }, (err) => {
        console.log(err);
      });
  }

  deleteResolutionPicture() {
    var that = this;
    firebase.storage().ref().child('resolutionPictures/' + this.utilities.user.uid + "/" + this.resolution.id + ".jpg").delete().then(function () {
      // Change remote and local picUrl
      delete that.resolution.iconUrl;
      that.resolutionImageChanged = true;
    }).catch(function (error) {
      alert(error.message);
    });
  }

  finishEditResolution() {
    if (this.resolution.iconUrl != undefined) {
      var that = this;
      var uploadTask = firebase.storage().ref().child('resolutionPictures/' + this.utilities.user.uid + "/" + this.resolution.id + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'});

      uploadTask.on('state_changed', function (snapshot) {
        that.loading = that.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        that.loading.present();

      }, function (error) {
        that.loading.dismiss();
        alert(error.message);
      }, function () {
        let localIsRecurring = (that.resolution.isRecurring == "true" || that.resolution.isRecurring == true);
        firebase.database().ref('users/' + that.utilities.user.uid + '/customResolutions').child(that.resolution.id).set({
          name: that.resolution.name,
          isRecurring: localIsRecurring,
          iconUrl: uploadTask.snapshot.downloadURL,
          isPreconfigured: false
        });
        that.loading.dismiss();
      });
    } else {
      let localIsRecurring = (this.resolution.isRecurring == "true" || this.resolution.isRecurring == true);
      firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions').child(this.resolution.id).set({
        name: this.resolution.name,
        isRecurring: localIsRecurring,
        isPreconfigured: false
      });
    }
    this.navCtrl.pop();
  }

  deleteResolution() {
    firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/' + this.resolution.id).remove();
    this.navCtrl.pop();
  }

  cancel() {
    this.navCtrl.pop();
  }
}
