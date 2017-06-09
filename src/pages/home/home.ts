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
    { name: "Jogging", done: false },
    { name: "Gym", done: false },
    { name: "Quit smoking", done: true },
    { name: "Eat healthy", done: false }
  ];

  goToPage(activity) {
    this.navCtrl.push(ActivitydetailsComponent, { activity: activity });
  }

}
