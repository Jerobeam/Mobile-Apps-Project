import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import { Utilities } from '../../app/utilities';
import {ResolutionProvider} from "../../providers/resolution-provider";
import {Camera} from 'ionic-native';
import { ActionSheetController, LoadingController, } from 'ionic-angular'

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html',
  providers: [ResolutionProvider],

})
export class CreateResolutionComponent {
  public resolution ;
  public isRecurringC: boolean=false;

  actionSheetOptions: any;
  public base64Image: string;
  public base64String: string;
  loading: any;

  constructor( public navCtrl: NavController,public utilities: Utilities,
               public actionSheetCtrl: ActionSheetController, public resolutionProvider: ResolutionProvider,
               public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController ) {
    this.resolution = this.formBuilder.group({
      name: [''],
      type: [''],
      imageUrl:['']
    });
  }

  isRecurringMethod(){
    if (this.resolution.value.type == 'Recurring Activity'){
      this.isRecurringC = true;
    } if (this.resolution.value.type == 'Single Activity'){
      this.isRecurringC = false;
    } else{

    }
    console.log(this.isRecurringC)
  }

  createResolution() {
    this.isRecurringMethod();
    console.log(this.resolution.value);
    this.resolutionProvider.createNewCustomResolution(
      {
        isPreconfigured: false,
        isRecurring: this.isRecurringC,
        name: this.resolution.value.name,
        iconUrl: this.resolution.value.imageUrl
      });
  }

  setActionSheetOptions() {
      this.actionSheetOptions = {
        title: 'Resolutionbild ändern',
        buttons: [
          {
            text: "Kamera",
            icon: "camera",
            handler: () => this.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => this.getPicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    }

  takePicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }

  getPicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }

  callCamera(options){
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64String = imageData;
        this.uploadPicture();
      }, (err) => {
        console.log(err);
      });
  }

  uploadPicture() {
    var that = this;
    var uploadTask = firebase.storage().ref().child('resolutionPictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid
      + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'});

    uploadTask.on('state_changed', function (snapshot) {
      that.loading = that.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      that.loading.present();

    }, function (error) {
      that.loading.dismiss();
      alert(error.message);
    }, function () {
      that.utilities.userData.picUrl = uploadTask.snapshot.downloadURL;
      firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/').update({
        iconUrl: that.utilities.userData.picUrl
      });
      that.loading.dismiss();
      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.setActionSheetOptions()
    });
  }

  changeResolutionPicture(){
    console.log("Change Picture");
    let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);

    actionSheet.present();
  }
}
