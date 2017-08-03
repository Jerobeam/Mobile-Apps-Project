import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { Battery } from '../pages/battery/battery';
import { CameraPage } from '../pages/cameraPage/cameraPage';
import { Orientation } from '../pages/orientation/orientation';
import { Geolocations } from '../pages/geolocations/geolocations';
import { NetworkInfo } from '../pages/networkInfo/networkInfo';
import { About } from '../pages/about/about';
import { Utilities } from './utilities';
import { ContactPage } from '../pages/contactPage/contactPage';


@Component({
  templateUrl: 'app.html',
  providers: [Utilities]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  aboutPage: any = {
    title: "About",
    component: About
  }


  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public utilities: Utilities) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Home },
      { title: 'Battery', component: Battery },
      { title: 'Camera', component: CameraPage },
      { title: 'Orientation', component: Orientation },
      { title: 'Geolocation', component: Geolocations },
      { title: 'Network', component: NetworkInfo },
      { title: 'Contacts', component: ContactPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
