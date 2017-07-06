import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-resolutionDetails.component',
  templateUrl: 'resolutionDetails.component.html',
})
export class ResolutionDetailsComponent implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  resolution: any;

  ngOnInit(){
    this.resolution = this.navParams.get('resolution');
    console.log(this.resolution);
    console.log("Test");
  }
}
