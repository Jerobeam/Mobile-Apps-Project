import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  templateUrl: 'camera.html'
})
export class CameraPage {
  public base64Image: string;

  constructor(private camera: Camera) {

  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 600,
      targetHeight: 600
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}
