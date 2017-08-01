import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, SocialSharing } from 'ionic-native';

@Component({
  selector: 'page-cameraPage',
  templateUrl: 'cameraPage.html'
})
export class CameraPage {
  public base64Image: string;
  public base64String: string;
  public buttonDisabled = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
  }

  share() {
    if (this.base64Image != null) {
      SocialSharing.share("Test", "Test", [this.base64Image], "");
    }
    else{
      this.presentToast("Please take a picture first");
    }
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  takePicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      quality: 75,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
      encodingType: Camera.EncodingType.JPEG,
    };
    this.callCamera(options);
  }

  callCamera(options) {
    Camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.base64String = imageData;
      this.buttonDisabled = false;
    });
  }


}

