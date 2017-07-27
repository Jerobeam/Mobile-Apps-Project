import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionSheetController, LoadingController,} from 'ionic-angular';
import {Utilities} from '../../app/utilities';
import firebase from 'firebase';

@Component({
  selector: 'page-editResolution',
  templateUrl: 'editResolution.component.html'
})
export class EditResolutionComponent {

  resolution: any;
  editResolutionForm: any;
  resolutionNameChanged = false;
  isRecurringChanged = false;
  resolutionImageChanged = false;
  actionSheetOptions: any;

  constructor(public navCtrl: NavController, public utilities: Utilities, public navParams: NavParams, private formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    this.resolution = navParams.get('resolution');
    this.editResolutionForm = this.formBuilder.group({
      resolutionName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      resolutionType: [''],
      iconUrl: ['']
    });
    this.setActionSheetOptions();
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

  takePicture(){
    console.log("take picture");
  }
  getPicture(){
    console.log("take picture");
  }
  deleteResolutionPicture(){
    console.log("take picture");
  }

  deleteResolution(){
    firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/' + this.resolution.id).remove();
    this.navCtrl.pop();
  }

  cancel(){
    this.navCtrl.pop();
  }
}
