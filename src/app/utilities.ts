/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { AlertController } from "ionic-angular";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class Utilities {

  inRegister: boolean = false;
  loggedIn: boolean = false;
  userLoaded: boolean = false;
  userData: any = {};
  user: any;
  amountOfDaysInCurrentYear: any;
  currentDay = new Date();
  currentDayString: any;

  constructor(public geofence: Geofence) {//public http: Http
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(new Date().getFullYear(), 1, 1);
    let secondDate = new Date(new Date().getFullYear(), 12, 31);
    this.amountOfDaysInCurrentYear = Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay));

    let mm = this.currentDay.getMonth() + 1;
    let dd = this.currentDay.getDate();
    this.currentDayString = [this.currentDay.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
  }

  sendPushNotification(pushIds: Array<any>, content: String) {
    let notificationObj = {
      contents: { en: content },
      include_player_ids: pushIds
    };
    window["plugins"].OneSignal.postNotification(notificationObj,
      function (successResponse) {
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
      }
    )
  }

  setReminder(pushIds: Array<any>, content: String, time: string) {
    let reminderTime = new Date(time);
    reminderTime.setDate(reminderTime.getDate());
    let notificationObj = {
      contents: { en: content },
      send_after: reminderTime,
      include_player_ids: pushIds
    };
    window["plugins"].OneSignal.postNotification(notificationObj,
      function (successResponse) {
        firebase.database().ref('users/').update({ delayedNotificationID: successResponse.id });
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
      }
    )
  }

  cancelPushNotification(notificationID: any) {
    let url = 'https://onesignal.com/api/v1/notifications/' + notificationID + '?app_id=69c4c123-c0aa-481b-a5f3-253642300266';
    let headers = new Headers({ 'Authorization': 'Basic ZWFlNjRiZTQtYjMwMy00NGEyLTk5Y2QtMmFhMGE5ZmY1NDgy' });
    let options = new RequestOptions({
      headers: headers
    });

    //this.http.delete(url, options).toPromise().catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  setInRegister(): void {
    this.inRegister = !this.inRegister;
  }

  public removeGeofence(geofenceID) {
    console.log("geofence to remove" + geofenceID);
    this.geofence.remove(geofenceID).then(() => {
      console.log("Geofence removed");
    });
  }

  public addGeofence(resolutionID, notificationTitle, notificationMessage) {
    //options describing geofence
    let fence = {
      id: this.makeID(), //any unique ID
      latitude: 49.474797,  //center of geofence radius
      longitude: 8.535164,
      radius: 100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: notificationTitle, //notification title
        text: notificationMessage, //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }
    console.log("addFence")
    console.log(fence);

    return this.geofence.addOrUpdate(fence).then(() => {
      firebase.database().ref('users/' + this.user.uid + '/activeResolutions/' + resolutionID + '/geofences/' + fence.id).set(fence),
        console.log(fence),
        (err) => console.log('Geofence failed to add');
    });
  }

  /**
   * Gets the data for the logged in userData from the database and sets the "userLoaded" flag to "true"
   */
  setUserData(): any {
    return firebase.database().ref('users/' + this.user.uid).once('value', snapshot => {
      if (snapshot.val() != null) {
        this.userData = snapshot.val();
        this.userLoaded = true;
      }
    })
  }

  getUser(userID: any): any {
    return firebase.database().ref('users/' + userID).once('value')
      .then(user => { return user });
  }

  updateUser(userID: any, data: any): any {
    return firebase.database().ref('users/' + userID).update(data);
  }

  makeID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    console.log("JapJepJup");

    for (var i = 0; i < 26; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}



