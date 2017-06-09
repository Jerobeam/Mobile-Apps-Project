import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActivitydetailsComponent } from '../activitydetails/activitydetails.component';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {

  }

  goToPage(activity) {
    this.navCtrl.push(ActivitydetailsComponent, { activity: activity });
  }

}
