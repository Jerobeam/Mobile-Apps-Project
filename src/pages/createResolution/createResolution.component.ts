import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html'
})
export class CreateResolutionComponent {
  resolution = {};
  isPreconfigured: boolean =false;
  isRecurring: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  isRecurring(){

  }

  setCustomerRes() {
    console.log(this.resolution)
  }









}
