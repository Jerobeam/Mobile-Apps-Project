import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';

@Component({
  selector: 'page-resolutionDetails.component',
  templateUrl: 'resolutionDetails.component.html',
})
export class ResolutionDetailsComponent implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
  }

  resolution: any;
  oldReminderFrequency: any;

  ngOnInit(){

    this.resolution = this.navParams.get('resolution');
    this.oldReminderFrequency = this.resolution.reminderFrequency;
  }

  backButtonPress() {
    if(this.oldReminderFrequency !== this.resolution.reminderFrequency){
      firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + this.resolution.id + '/').update({
        reminderFrequency: this.resolution.reminderFrequency
      });
    }
    this.navCtrl.pop();
  }

  doneResolutionToday(event, resolution) {
    resolution.secondLastActivity = resolution.lastActivity;
    resolution.lastActivity = this.utilities.currentDayString;
    resolution.activeDays[this.utilities.currentDayNumber] = true;
    firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolution.id + '/').update({
      secondLastActivity: resolution.secondLastActivity,
      lastActivity: resolution.lastActivity,
      activeDays: resolution.activeDays
    });
  }

  undoDoneResolutionToday(event, resolution) {
    resolution.lastActivity = resolution.secondLastActivity
    resolution.activeDays[this.utilities.currentDayNumber] = false;
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

  undoDoneSingleResolution(event, resolution) {
    event.stopPropagation();
    resolution.isDone = false;
    firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolution.id + '/').update({
      isDone: resolution.isDone
    });
  }
}
