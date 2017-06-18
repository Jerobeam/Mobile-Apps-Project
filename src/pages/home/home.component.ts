import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ActivitydetailsComponent} from '../activitydetails/activitydetails.component';
import {ManageResolutionsComponent} from '../manageResolutions/manageResolutions.component';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-home',
  templateUrl: 'home.component.html'
})
export class Home {

  recurrance: string = "all";
  today: string = "2017-06-21";
  daysInYear: Array<any> = [];
  progressWidth: any;
  daysInYearTest: Array<any> = [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0
    , 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1];


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(2017, 1, 1);
    var secondDate = new Date(2017, 12, 31);
    let amountOfDays = Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay));

    this.daysInYear = new Array(amountOfDays);

    for (let i = 0; i < this.daysInYear.length; i++) {
      if (Math.random() > 0.5) {
        this.daysInYear[i] = 0;
      } else {
        this.daysInYear[i] = 1;
      }
    }
    this.progressWidth = 100 / amountOfDays;
    console.log(this.daysInYear);
    console.log(this.progressWidth);
    this.calculateCurrentDayNumber();
  }

  calculateCurrentDayNumber() {
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(2017, 1, 1);
    // var secondDate = new Date(2017,12,31);
    let secondDate = new Date();

    let diffDays = Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay));

    console.log(diffDays);
  }

  goToPage(event, resolution) {
    this.navCtrl.push(ActivitydetailsComponent, {activity: resolution});
  }

  doneResolutionToday(event, resolution){
    event.stopPropagation();
    resolution.secondLastActivity = resolution.lastActivity;
    resolution.lastActivity = this.today;
  }

  doneSingleResolution(event, resolution){
    event.stopPropagation();
    resolution.isDone = true;
  }

  goToPageManageResolutions() {
    this.navCtrl.push(ManageResolutionsComponent);
  }

}
