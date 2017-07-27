import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyResolutions } from '../pages/myResolutions/myResolutions.component';
import { LoginComponent } from '../pages/login/login.component';
import { ManageResolutionsComponent } from '../pages/manageResolutions/manageResolutions.component';
import firebase from 'firebase';
import { firebaseConfig } from "./firebaseAppData";
import { AuthData } from '../providers/auth-data';
import { Utilities } from './utilities';
import { AlertController } from "ionic-angular";
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation'

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [AuthData, Utilities]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;
  notificationPressed: boolean = false;
  authenticated: boolean = false;

  constructor(private geolocation: Geolocation, public geofence: Geofence, public alertCtrl: AlertController, public authData: AuthData, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public utilities: Utilities) {
    this.initializeApp();


    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;
      if (user != undefined) {
        utilities.user = user;
        utilities.setUserData();
        this.checkIfUserDeleted(user.uid);
      }
      if (!user) {
        utilities.loggedIn = false;
        utilities.user = {};
        this.rootPage = LoginComponent;
      } else {
        // if (this.nav.getActive() == undefined) {
        //if (this.loadUserCredentials()) {
        this.rootPage = MyResolutions;
        this.authenticated = true;
        //}//
        /* else {
             this.rootPage = LoginComponent;
           }*/
      }
      //this.utilities.countOpen();
      this.notificationPressed = false;
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MyResolutions', component: MyResolutions },
      { title: 'Resolution Management', component: ManageResolutionsComponent }
    ];
  }

  checkIfUserDeleted(userID: any): any {
    return this.utilities.getUser(userID)
      .then(user => {
        console.log("in then");
        console.log(user);
        console.log(user.val());
        if (user.val() != null) {
          if (!this.utilities.inRegister) {
            this.checkForVerification();
          }
          // if (user.val().email) {
          //   this.checkPlatform(userID);
          // }
          this.utilities.loggedIn = true;
        } else {
          this.logout();
          let alert = this.alertCtrl.create({
            title: 'Ihr Account wurde gelöscht',
            message: 'Es scheint so als wäre Ihr Account gelöscht worden. Bitte kontaktieren Sie Ihren Trainer.',
            buttons: [
              {
                text: "Ok",
                handler: () => {

                }
              }
            ]
          });
          alert.present();
        }
      })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Check for cordova, since it is only available on native iOS/Android
      this.utilities.cordova = this.platform.is('cordova');
      if (this.utilities.cordova) {
        this.geofence.initialize().then(() => {
          console.log('Geofence Plugin Ready'),
            (err) => console.log(err);
        });
        let notificationOpenedCallback = (jsonData) => {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          if (this.authenticated) {
            this.nav.push(MyResolutions);
          }
          else {
            this.notificationPressed = true;
          }
        };

        window["plugins"].OneSignal
          .startInit("69c4c123-c0aa-481b-a5f3-253642300266", "630182428381")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        /*console.log("Daten");
        console.log(data.coords.latitude);
        console.log(data.coords.longitude);
        console.log("==================");*/
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
      });
    });

  }

  logout() {
    this.authData.logoutUser();
    this.nav.setRoot(LoginComponent);
  }

  // checkPlatform(userID) {
  //   let flag = false;
  //   let tempPlat = "";
  //
  //   if (this.platform.is('ios')) {
  //     tempPlat = "ios";
  //   } else if (this.platform.is('android')) {
  //     tempPlat = "android";
  //   } else {
  //     tempPlat = "web";
  //   }
  //
  //   this.utilities.updateUser(userID, { platform: tempPlat });
  // }

  checkForVerification() {
    if (!this.utilities.user.emailVerified) {
      let confirm = this.alertCtrl.create({
        title: 'Bitte bestätigen Sie Ihre Email Adresse',
        message: 'Bestätigunsmail erneut senden?',
        buttons: [
          {
            text: 'Nein',
            handler: () => {
            }
          },
          {
            text: 'Ja',
            handler: () => {
              this.utilities.user.sendEmailVerification();
            }
          }
        ]
      });
      confirm.present();
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
