import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionSheetController, LoadingController, AlertController} from 'ionic-angular';
import {Utilities} from '../../app/utilities';
import firebase from 'firebase';
import {ResolutionProvider} from "../../providers/resolution-provider";
import {Camera} from 'ionic-native';

@Component({
  selector: 'page-editResolution',
  templateUrl: 'editResolution.component.html',
  providers: [ResolutionProvider]
})
export class EditResolutionComponent {

  loadingElement: any;
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

  constructor(public navCtrl: NavController,
              public resolutionProvider: ResolutionProvider,
              public utilities: Utilities,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController) {
    this.resolution = navParams.get('resolution');
    this.editResolutionForm = this.formBuilder.group({
      resolutionName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      resolutionType: [''],
      iconUrl: ['']
    });
    this.resolutionNameOld = this.resolution.name;
    this.isRecurringOld = this.resolution.isRecurring;
  }

  ionViewWillEnter() {
    this.showLoadingElement();
    this.utilities.setUserData().then(() => {
      this.resolutionProvider.getActiveResolutions().then(() => {
        this.loadingElement.dismiss();
      });
    });
  }
  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Load Data'
    })
    this.loadingElement.present();
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
      alert.present();
    }
  }

  callCamera(options) {
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64String = imageData;
        this.resolution.iconUrl = "data:image/JPEG;base64," + this.base64String;
        this.resolutionImageChanged = true;
      }, (err) => {
        console.log(err);
      });
  }

  deleteResolutionPicture() {
    var that = this;
    return firebase.storage().ref().child('resolutionPictures/' + this.utilities.user.uid + "/" + this.resolution.id + ".jpg").delete().then(function () {
      // Change remote and local picUrl
      delete that.resolution.iconUrl;
      that.resolutionImageChanged = true;
    }).catch(function (error) {
      alert(error.message);
    });
  }

  showFinishConfirm(){
    if(this.isActive(this.resolution) && this.isRecurringChanged){
      let alert = this.alertCtrl.create({
        title: 'Occurance type changed',
        message: 'You changed the occurance type. This will remove this resolution from "My Resolutions" and all progress will be lost. Are you sure you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.removeFromActiveResolutions(this.resolution);
              this.finishEditResolution();
            }
          }
        ]
      });
      alert.present()
    }else{
      this.finishEditResolution();
    }
  }

  finishEditResolution() {
    if (this.resolution.iconUrl != undefined && this.resolutionImageChanged) {
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
        }).then(() => {
          that.navCtrl.pop();
        });
        that.loading.dismiss();
      });
    } else {
      let localIsRecurring = (this.resolution.isRecurring == "true" || this.resolution.isRecurring == true);
      firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions').child(this.resolution.id).update({
        name: this.resolution.name,
        isRecurring: localIsRecurring,
        isPreconfigured: false
      }).then(() => {
        this.navCtrl.pop();
      });
    }

  }

  showDeletionConfirm(){
    let alert = this.alertCtrl.create({
      title: 'Delete resolution?',
      message: 'Are you sure you want to delete this resolution? If this resolution is active your progress will be lost!',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteResolution();
          }
        }
      ]
    });
    alert.present()
  }

  deleteResolution() {
    if(this.isActive(this.resolution)){
      this.removeFromActiveResolutions(this.resolution);
    }
    if (this.resolution.iconUrl != undefined) {
      this.deleteResolutionPicture().then(() => {
        firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/' + this.resolution.id).remove().then(() => {
          this.navCtrl.pop();
        });
      });

    } else {
      firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/' + this.resolution.id).remove().then(() => {
        this.navCtrl.pop();
      });
    }

  }

  isActive(resolution) {
    for (let i of this.resolutionProvider.activeResolutions) {
      if (i.id == resolution.id) {
        return true;
      }
    }
    return false;
  }

  removeFromActiveResolutions(resolutionItem) {
    this.utilities.setUserData();
    if (this.utilities.cordova) {
      for (let i of this.resolutionProvider.activeResolutions) {
        if (i.id == resolutionItem.id) {
          for (let j in i.geofences) {
            this.utilities.removeGeofence(j, resolutionItem.id);
          }
          for (let k in i.scheduledNotifications) {
            this.utilities.cancelPushNotification(k, resolutionItem.id);
          }
        }
      }
    }
    this.resolutionProvider.updateResolutionStatus("inactive", resolutionItem.id, {}).then(() => {
      this.resolutionProvider.getActiveResolutions();
    });
    return Promise.resolve();
  }

  cancel() {
    this.navCtrl.pop();
  }
}
