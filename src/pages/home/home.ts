import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActivitydetailsComponent } from '../activitydetails/activitydetails.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  activities = [
    { name: "Jogging" },
    { name: "Gym" },
    { name: "Quit smoking" },
    { name: "Eat healthy" }
  ];

  goToPage(activity) {
    this.navCtrl.push(ActivitydetailsComponent, { activity: activity });
  }

}
