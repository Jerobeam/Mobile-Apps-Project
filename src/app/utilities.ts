/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
/*import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
*/


@Injectable()
export class Utilities {

  inRegister: boolean = false;
  loggedIn: boolean = false;
  userLoaded: boolean = false;
  userData: any = {};
  user: any;
  amountOfDaysInCurrentYear: any;
  currentDay = new Date();

  resolutions = [
    {
      name: "Running", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, activeDays: [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0
        , 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
        1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
        0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1], lastActivity: "2017-06-21", secondLastActivity: "2017-06-15", iconUrl: "assets/images/running-icon.jpg"
    },
    { name: "Stop Smoking", isSingleActivity: true, isPreconfigured: true, isActive: true, isDone: false, iconUrl: "assets/images/running-icon.jpg" },
    { name: "Learn Spanish", isSingleActivity: true, isPreconfigured: true, isActive: true, isDone: true, iconUrl: "assets/images/running-icon.jpg" },
    {
      name: "Lose Weight", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, lastActivity: "2017-06-18", secondLastActivity: "2017-06-07",
      iconUrl: "assets/images/running-icon.jpg"
    },
    {
      name: "Football", isSingleActivity: false, isPreconfigured: false, isActive: true, isDone: true, activeDays: [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0,
        1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
        0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1], lastActivity: "2017-06-20", secondLastActivity: "2017-06-06", iconUrl: "assets/images/running-icon.jpg"
    },
    { name: "Socialize", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, contacts: [], iconUrl: "assets/images/running-icon.jpg" }
  ];

  constructor(public geofence: Geofence) {
    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
    let firstDate = new Date(new Date().getFullYear(), 1, 1);
    var secondDate = new Date(new Date().getFullYear(), 12, 31);
    this.amountOfDaysInCurrentYear = Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay));
  }

  setInRegister(): void {
    this.inRegister = !this.inRegister;
  }

  public addGeofence() {
    //options describing geofence
    let fences = [];
    let fence = {
      id: this.makeID(), //any unique ID
      latitude: 49.478557,  //center of geofence radius
      longitude: 8.508034,
      radius: 15, //radius to edge of geofence in meters
      transitionType: 1, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: 'Neue Location', //notification title
        text: 'Sie sind an Location 14', //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }
    fences.push(fence);
    fence = {
      id: this.makeID(), //any unique ID
      latitude: 49.478381,  //center of geofence radius
      longitude: 8.507825,
      radius: 100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: 'Neue Location', //notification title
        text: 'Sie sind an der Nr. 12', //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }
    fences.push(fence);
    fence = {
      id: this.makeID(), //any unique ID
      latitude: 49.474312,  //center of geofence radius
      longitude: 8.534947,
      radius: 100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: 'Neue Location', //notification title
        text: 'Sie sind an der DHBW', //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }
    fences.push(fence);
    console.log("addFence")
    console.log(fence);

    this.geofence.addOrUpdate(fences).then(
      () => console.log(fences),
      (err) => console.log('Geofence failed to add'),
    );
    console.log(this.geofence.getWatched());
  }

  /**
   * Gets the data for the logged in userData from the database and sets the "userLoaded" flag to "true"
   */
  setUserData(): void {
    firebase.database().ref('users/' + this.user.uid).once('value', snapshot => {
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



