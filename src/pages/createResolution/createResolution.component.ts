import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {Utilities} from '../../app/utilities';
import {ResolutionProvider} from "../../providers/resolution-provider";
import {Camera} from 'ionic-native';
import {ActionSheetController, LoadingController, AlertController} from 'ionic-angular'
import firebase from 'firebase';

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html',
  providers: [ResolutionProvider],

})
export class CreateResolutionComponent {
  public createResolutionForm;

  actionSheetOptions: any;
  public base64String: string;
  loading: any;
  iconUrl = "assets/images/default_resolution_256.png";
  resolutionId;
  resolutionName = "";
  isRecurring: any = true;

  constructor(public navCtrl: NavController,
              public utilities: Utilities,
              public actionSheetCtrl: ActionSheetController,
              public resolutionProvider: ResolutionProvider,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController){
    this.createResolutionForm = this.formBuilder.group({
      resolutionName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      resolutionType: [''],
      iconUrl: ['']
    });
  }

  setActionSheetOptions() {
    if (this.iconUrl == "assets/images/default_resolution_256.png") {
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

  changeResolutionPicture() {
    this.setActionSheetOptions();
    let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);
    actionSheet.present();
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
        this.iconUrl = "data:image/JPEG;base64," + this.base64String;
      }, (err) => {
        console.log(err);
      });
  }

  deleteResolutionPicture() {
    this.iconUrl = "assets/images/default_resolution_256.png";
  }

  createResolution() {
    this.resolutionId = this.makeResolutionId();
    if (this.iconUrl != "assets/images/default_resolution_256.png") {
      var that = this;
      var uploadTask = firebase.storage().ref().child('resolutionPictures/' + this.utilities.user.uid + "/" + this.resolutionId + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'});

      uploadTask.on('state_changed', function (snapshot) {
        that.loading = that.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        that.loading.present();

      }, function (error) {
        that.loading.dismiss();
        alert(error.message);
      }, function () {
        let localIsRecurring = (that.isRecurring == "true" || that.isRecurring == true);
        firebase.database().ref('users/' + that.utilities.user.uid + '/customResolutions').child(that.resolutionId).set({
          name: that.resolutionName,
          isRecurring: localIsRecurring,
          iconUrl: uploadTask.snapshot.downloadURL,
          isPreconfigured: false
        }).then(() => {
          that.loading.dismiss();
          that.navCtrl.pop();
        });
      });
    } else {
      let localIsRecurring = (this.isRecurring == "true" || this.isRecurring == true);
      firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions').child(this.resolutionId).set({
        name: this.resolutionName,
        isRecurring: localIsRecurring,
        isPreconfigured: false
      }).then(() => {
        this.navCtrl.pop();
      });
    }
  }

  makeResolutionId() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 26; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
  }
}
