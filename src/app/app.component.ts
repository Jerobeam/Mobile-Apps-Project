import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MyResolutions} from '../pages/myResolutions/myResolutions.component';
import {LoginComponent} from '../pages/login/login.component';
import firebase from 'firebase';
import {firebaseConfig} from "./firebaseAppData";
import {AuthData} from '../providers/auth-data';
import {Utilities} from './utilities';
import {AlertController} from "ionic-angular";
import {Geofence} from '@ionic-native/geofence';
import {Geolocation} from '@ionic-native/geolocation'

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [AuthData, Utilities]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  notificationPressed: boolean = false;
  authenticated: boolean = false;

  constructor(private geolocation: Geolocation, public geofence: Geofence, public alertCtrl: AlertController, public authData: AuthData, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public utilities: Utilities) {
    this.initializeApp();


    firebase.auth().onAuthStateChanged((user) => {
      if (user != undefined) {
        utilities.user = user;
        utilities.setUserData();
      }
      if (!user) {
        utilities.loggedIn = false;
        utilities.user = {};
        this.rootPage = LoginComponent;
      } else {
        this.rootPage = MyResolutions;
        this.authenticated = true;
      }
      this.notificationPressed = false;
    });
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

        if (this.utilities.cordova) {
          window["plugins"].OneSignal
            .startInit("69c4c123-c0aa-481b-a5f3-253642300266", "630182428381")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        }
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

  checkForVerification() {
    if (!this.utilities.user.emailVerified) {
      let confirm = this.alertCtrl.create({
        title: 'Please confirm your mail adress',
        message: 'Send another confirmation mail?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.utilities.user.sendEmailVerification();
            }
          }
        ]
      });
      confirm.present();
    }
  }
}
