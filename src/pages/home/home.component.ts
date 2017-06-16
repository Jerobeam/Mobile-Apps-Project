import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActivitydetailsComponent } from '../activitydetails/activitydetails.component';
import { ManageResolutionsComponent } from '../manageResolutions/manageResolutions.component';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-home',
  templateUrl: 'home.component.html'
})
export class Home implements OnInit{

  ngOnInit(): void {
    this.calculateCurrentDayNumber();
    console.log("lol");
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {

    console.log("construcor");
  }

  calculateCurrentDayNumber(){
    let oneDay = 24*60*60*1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(2017,1,1);
    // var secondDate = new Date(2017,12,31);
    let secondDate = new Date();

    let diffDays = Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay));

    console.log(diffDays);
  }

  goToPage(activity) {
    this.navCtrl.push(ActivitydetailsComponent, { activity: activity });
  }

  goToPageManageResolutions() {
    this.navCtrl.push(ManageResolutionsComponent);
  }

}
