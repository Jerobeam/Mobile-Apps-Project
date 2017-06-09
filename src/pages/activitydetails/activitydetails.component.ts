import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-activitydetails.component',
  templateUrl: 'activitydetails.component.html',
})
export class ActivitydetailsComponent {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  activity: any;

  ionViewWillEnter(){
    this.activity = this.navParams.get("activity");
  }

}
