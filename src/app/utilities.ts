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
  currentDayNumber: any;
  cordova: any;

  geolocations = [
    { name: "DHBW Library", latitude: 49.473169, longitude: 8.535130, category: "study" },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 },
    { name: "DHBW Mannheim", latitude: 49.473169, longitude: 8.535130 }
  ];

  /*  {}, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },
  { }, { }, { }, { },*/

  constructor(public http: Http, public geofence: Geofence) {
    this.calculateCurrentDayNumber();
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(this.currentDay.getFullYear(), 1, 1);
    let secondDate = new Date(this.currentDay.getFullYear(), 12, 31);
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

  setReminder(pushIds: Array<any>, content: String, time: Date, resolutionID) {
    let notificationObj = {
      contents: { en: content },
      send_after: time,
      include_player_ids: pushIds
    };
    let user = this.user;
    window["plugins"].OneSignal.postNotification(notificationObj,
      function (successResponse) {
        firebase.database().ref('users/' + user.uid + '/activeResolutions/' + resolutionID + '/scheduledNotifications/' + successResponse.id).set(true);
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
      }
    );
    this.setUserData();
  }

  scheduleResolutionNotifications(resolutionItem, frequency) {
    console.log("schedule push");
    if (resolutionItem.isRecurring == true) {
      let pushIDs = [];
      for (let pushID in this.userData.pushid) {
        pushIDs.push(pushID);
      }
      let content = "Reminder: " + resolutionItem.name + "?";
      let startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(13);
      startDate.setMinutes(5);
      let endDate = new Date(startDate.getFullYear() + "-12-31");
      endDate.setHours(13);
      endDate.setMinutes(5);
      for (let i = startDate; i.getTime() < endDate.getTime(); i.setDate(i.getDate() + frequency)) {
        this.setReminder(pushIDs, content, i, resolutionItem.id);
      }
    }
  }

  cancelPushNotification(notificationID: any, resolutionID) {
    console.log("cancel push");
    let url = 'https://onesignal.com/api/v1/notifications/' + notificationID + '?app_id=69c4c123-c0aa-481b-a5f3-253642300266';
    let headers = new Headers({ 'Authorization': 'Basic ZWFlNjRiZTQtYjMwMy00NGEyLTk5Y2QtMmFhMGE5ZmY1NDgy' });
    let options = new RequestOptions({
      headers: headers
    });

    this.http.delete(url, options)
      .toPromise()
      .catch(this.handleError);
    return firebase.database().ref('users/' + this.user.uid + '/activeResolutions/' + resolutionID + "/scheduledNotifications/" + notificationID).remove();
  }

  calculateCurrentDayNumber() {
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(new Date().getFullYear(), 0, 1);

    let diffDays = Math.floor(Math.abs((firstDate.getTime() - this.currentDay.getTime()) / (oneDay)));

    this.currentDayNumber = diffDays;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  setInRegister(): void {
    this.inRegister = !this.inRegister;
  }

  public removeGeofence(geofenceID, resolutionID) {
    this.geofence.remove(geofenceID).then(() => {
      console.log("geofence removed");
      return firebase.database().ref('users/' + this.user.uid + '/activeResolutions/' + resolutionID + "/geofences/" + geofenceID).remove();
    });
  }

  public addGeofence(resolutionID, notificationTitle, notificationMessage, latitude, longitude) {
    console.log("Add Geofence triggered");
    let fence = {
      id: this.makeID(),
      latitude: latitude,
      longitude: longitude,
      radius: 100, //radius in meters
      transitionType: 3,
      notification: {
        id: 1,
        title: notificationTitle,
        text: notificationMessage,
        openAppOnClick: true
      }
    }

    return this.geofence.addOrUpdate(fence).then(() => {
      firebase.database().ref('users/' + this.user.uid + '/activeResolutions/' + resolutionID + '/geofences/' + fence.id).set(fence),
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
    for (var i = 0; i < 26; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}



