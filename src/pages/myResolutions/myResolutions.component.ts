import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ActivitydetailsComponent } from '../activitydetails/activitydetails.component';
import { ManageResolutionsComponent } from '../manageResolutions/manageResolutions.component';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-home',
  templateUrl: 'src/pages/myResolutions/myResolutions.component.html'
})
export class MyResolutions {

  displayName: any;
  recurrance: string = "all";
  // today: string = "2017-06-21";
  daysInYear: Array<any> = [];
  progressWidth: any;
  daysInYearTest: Array<any> = [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0
    , 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1];


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
    // for (let i = 0; i < this.daysInYear.length; i++) {
    //   if (Math.random() > 0.5) {
    //     this.daysInYear[i] = 0;
    //   } else {
    //     this.daysInYear[i] = 1;
    //   }
    // }
    // this.progressWidth = 100 / amountOfDays;
    // console.log(this.daysInYear);
    // console.log(this.progressWidth);
    this.calculateCurrentDayNumber();
  }

  ionViewWillEnter() {
    this.displayName = this.utilities.userData.lastname;
    console.log(this.displayName);
}

  calculateCurrentDayNumber() {
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(new Date().getFullYear(), 1, 1);
    // var secondDate = new Date(2017,12,31);

    let diffDays = Math.abs((firstDate.getTime() - this.utilities.currentDay.getTime()) / (oneDay));

    console.log(diffDays);
  }

  goToPage(event, resolution) {
    this.navCtrl.push(ActivitydetailsComponent, { activity: resolution });
  }

  doneResolutionToday(event, resolution) {
    event.stopPropagation();
    resolution.secondLastActivity = resolution.lastActivity;
    resolution.lastActivity = this.utilities.currentDay;
  }

  doneSingleResolution(event, resolution) {
    event.stopPropagation();
    resolution.isDone = true;
  }

  goToPageManageResolutions() {
    this.navCtrl.push(ManageResolutionsComponent);
  }

}
