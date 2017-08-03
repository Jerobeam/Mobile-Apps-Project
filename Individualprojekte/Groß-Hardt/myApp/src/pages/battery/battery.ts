import { Component, NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Utilities } from '../../app/utilities';

import { BatteryStatus } from 'ionic-native';

@Component({
  selector: 'page-battery',
  templateUrl: 'battery.html'
})
export class Battery {

  constructor(public navCtrl: NavController, public zone: NgZone, private utilities: Utilities) {
    let subscription = BatteryStatus.onChange();

    subscription.subscribe((status) => {
      zone.runOutsideAngular(() => {
        this.utilities.batteryState = "Battery Level: " + status.level + "%";
        if (status.isPlugged == true) {
          this.utilities.plugged = "Charging";
        } else {
          this.utilities.plugged = "Not Charging";
        }
      })
    });

    /*zone.runOutsideAngular(() => {
      window.addEventListener("batterystatus",(status) => {
      this.utilities.batteryState = "Battery Level: " + status["level"] + "%";
       if (status["isPlugged"] == true) {
          this.utilities.plugged = "Charging";
        } else {
          this.utilities.plugged = "Not Charging";
        }
      })
    });*/
  }
}

