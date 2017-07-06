import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ResolutionDetailsComponent } from '../resolutionDetails/resolutionDetails.component';
import { ManageResolutionsComponent } from '../manageResolutions/manageResolutions.component';
import { Utilities } from '../../app/utilities';
import { ResolutionProvider } from '../../providers/resolution-provider';
import { AuthData } from '../../providers/auth-data';
import firebase from 'firebase';

@Component({
  selector: 'page-myResolutions',
  templateUrl: 'myResolutions.component.html',
  providers: [AuthData, ResolutionProvider]
})
export class MyResolutions {

  recurrance: string = "all";
  progressWidth: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities, public resolutionProvider: ResolutionProvider) {
    // this.progressWidth = 100 / amountOfDays;

  }

  ionViewWillEnter() {
    this.utilities.setUserData().then(() => {
      this.resolutionProvider.getActiveResolutions();
    });
  }

  goToPage(event, resolution) {
    this.navCtrl.push(ResolutionDetailsComponent, { resolution: resolution });
  }

  doneResolutionToday(event, resolution) {
    event.stopPropagation();
    resolution.secondLastActivity = resolution.lastActivity;
    resolution.lastActivity = this.utilities.currentDayString;
    resolution.activeDays[this.utilities.currentDayNumber] = true;
    firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolution.id + '/').update({
      secondLastActivity: resolution.secondLastActivity,
      lastActivity: resolution.lastActivity,
      activeDays: resolution.activeDays
    });
  }

  doneSingleResolution(event, resolution) {
    event.stopPropagation();
    resolution.isDone = true;
    firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolution.id + '/').update({
      isDone: resolution.isDone
    });
  }

  goToPageManageResolutions() {
    this.navCtrl.push(ManageResolutionsComponent);
  }
}
