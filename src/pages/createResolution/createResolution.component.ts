import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html'
})
export class CreateResolutionComponent {
  resolution = {}
  logForm() {
    console.log(this.resolution)
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }





}
