import { Component, NgZone } from '@angular/core';

import { ToastController } from 'ionic-angular'

import { Geolocation } from 'ionic-native';

import { Utilities } from '../../app/utilities';

@Component({
    selector: 'page-geolocations',
    templateUrl: 'geolocations.html'
})
export class Geolocations {
    errorMessage = "Position cannot be tracked. Check if you have GPS enabled on your phone.";
    trackingMessage = "Not currently tracking";
    trackingMessageStyle = "this-not-tracking";
    watch: any;
    isTracking = false;
    watchOptions = {
        maximumAge: 100,
        timeout: 60 * 60 * 1000,
        enableHighAccuracy: true // may cause errors if true
    };

    constructor(private utilities: Utilities, public toastCtrl: ToastController, private zone: NgZone) {

    }

    track() {
        if (this.isTracking == false) {
            this.presentToast("Started tracking location");
            this.isTracking = true;
            this.trackingMessage = "Currently tracking";
            this.trackingMessageStyle = "this-tracking";
            this.zone.run(() => {
                this.watch = Geolocation.watchPosition(this.watchOptions);
                this.watch.subscribe((data) => {
                    // data can be a set of coordinates, or an error (if an error occurred).   
                    if (this.isTracking) {
                        this.utilities.latitude = data.coords.latitude;
                        this.utilities.longitude = data.coords.longitude;
                    }
                });
            });
        }
        else {
            this.presentToast("Already tracking");
        }
    }

    stop() {
        if (this.isTracking) {
            this.isTracking = false;
            this.trackingMessage = "Not currently tracking";
            this.presentToast("Stopped tracking");
            this.trackingMessageStyle = "this-not-tracking";
            /*this.zone.run(() => {
                this.watch.unsubscribe().then(this.presentToast("Stopped"));
            });*/
        }

    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

}

