import { Component } from '@angular/core';

import { DeviceOrientation, DeviceOrientationCompassHeading } from 'ionic-native';

import { Utilities } from '../../app/utilities';

@Component({
    selector: 'page-orientation',
    templateUrl: 'orientation.html'
})
export class Orientation {
    heading: any;
    trueHeading: any;

    constructor(private utilities: Utilities) {
        var subscription = DeviceOrientation.watchHeading();
        subscription.subscribe(
            (data: DeviceOrientationCompassHeading) => {
                console.log(data);
                this.heading = data.magneticHeading;
                this.trueHeading = data.trueHeading;
            }
        );
    }

}

