/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import firebase from 'firebase';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class Utilities {

  inRegister: boolean = false;
  loggedIn: boolean = false;
  LOCAL_TOKEN_KEY: string = 'MobileApps';
  userLoaded: boolean = false;
  userData: any = {};
  user: any;
  hashedPassword = -1719170103;


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

  getResolutions() {
    return this.resolutions;
  }

  constructor() {

  }

  setInRegister(): void {
    this.inRegister = !this.inRegister;
  }

  /**
   * Gets the data for the logged in userData from the database and sets the "userLoaded" flag to "true"
   */
  setUserData(): void {
    firebase.database().ref('users/' + this.user.uid).once('value', snapshot => {
      if (snapshot.val() != null) {
        console.log("in snapshot");
        this.userData = snapshot.val();
        this.userLoaded = true;
      }
    })
  }

  getUser(userID: any): any {
    return firebase.database().ref('users/' + userID).once('value')
      .then(user => { console.log("in utilities then"); return user });
  }

  updateUser(userID: any, data: any): any {
    return firebase.database().ref('users' + userID).update(data);
  }

  hashPassword(password): any {
    let hash = 0, i, chr, len;
    if (password.length === 0) return hash;
    for (i = 0, len = password.length; i < len; i++) {
      chr = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
}



