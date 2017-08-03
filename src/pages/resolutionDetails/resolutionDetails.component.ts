import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { ResolutionProvider } from '../../providers/resolution-provider';
import firebase from 'firebase';

@Component({
  selector: 'page-resolutionDetails.component',
  templateUrl: 'resolutionDetails.component.html',
  providers: [ResolutionProvider]
})
export class ResolutionDetailsComponent implements OnInit {

  constructor(public resolutionProvider: ResolutionProvider, public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {
  }

  resolution: any;
  oldReminderFrequency: any;

  ngOnInit() {

    this.resolution = this.navParams.get('resolution');
    this.oldReminderFrequency = this.resolution.reminderFrequency;
  }

  backButtonPress() {
    if (this.oldReminderFrequency !== this.resolution.reminderFrequency) {
      let frequency;
      if (this.resolution.reminderFrequency == 0) {
        frequency = 1;
      } else if (this.resolution.reminderFrequency == 1) {
        frequency = 3;
      } else if (this.resolution.reminderFrequency == 2) {
        frequency = 7;
      } else if (this.resolution.reminderFrequency == 3) {
        frequency = 14;
      } else if (this.resolution.reminderFrequency == 4) {
        frequency = 21;
      }
      if(this.utilities.cordova) {
        this.updateFrequency(frequency).then(() => {
          this.resolutionProvider.getActiveResolutions();
          this.navCtrl.pop();
        });
      }
    }
    else {
      this.navCtrl.pop();
    }
  }

  updateFrequency(frequency) {
    this.resolutionProvider.updateResolutionStatus("active", this.resolution.id,
      {
        reminderFrequency: this.resolution.reminderFrequency
      })
      .then(() => {
        this.resolutionProvider.getActiveResolutions();
        if (this.utilities.cordova) {
          for (let k in this.resolution.scheduledNotifications) {
            this.utilities.cancelPushNotification(k, this.resolution.id);
          }
          if (this.resolution.reminderFrequency != 5) {
            this.utilities.scheduleResolutionNotifications(this.resolution, frequency);
          }
        }
      });
    return Promise.resolve();
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
