import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from 'ionic-native';

@Component({
    selector: 'page-networkInfo',
    templateUrl: 'networkInfo.html'
})

export class NetworkInfo {
    networkStatus: any;
    networkType: any;

    constructor(public navCtrl: NavController, public zone: NgZone) {
        
        let connectSubscription = Network.onConnect();
        connectSubscription.subscribe(() => {
            zone.runOutsideAngular(() => {
                setTimeout(() => {
                    if (Network.type === 'wifi') {
                        this.networkStatus = "Connected via WiFi";
                    }
                    else if (Network.type === 'ethernet') {
                        this.networkStatus = "Connected via ethernet";
                    }
                    else if (Network.type === '3g') {
                        this.networkStatus = "Connected via 3g";
                    }
                    else if (Network.type === '2g') {
                        this.networkStatus = "Connected via 2g";
                    }
                    if (Network.type === '4g') {
                        this.networkStatus = "Connected via 4g";
                    }
                    if (Network.type === 'cellular') {
                        this.networkStatus = "Connected via cellular connection";
                    }
                }, 3000);
            });

        });

        /*let changeSubscription = Network.ontypechange();
        changeSubscription.subscribe(() => {
            zone.runOutsideAngular(() => {
                setTimeout(() => {
                    if (Network.type === 'wifi') {
                        this.networkStatus = "Connected via WiFi";
                    }
                    else if (Network.type === 'ethernet') {
                        this.networkStatus = "Connected via ethernet";
                    }
                    else if (Network.type === '3g') {
                        this.networkStatus = "Connected via 3g";
                    }
                    else if (Network.type === '2g') {
                        this.networkStatus = "Connected via 2g";
                    }
                    if (Network.type === '4g') {
                        this.networkStatus = "Connected via 4g";
                    }
                    if (Network.type === 'cellular') {
                        this.networkStatus = "Connected via cellular connection";
                    }
                }, 3000);
            });
        });*/

        let disconnectSubscription = Network.onDisconnect();

        disconnectSubscription.subscribe(() => {
            zone.runOutsideAngular(() => {
                this.networkStatus = "Not connected";
            });
        });

        /*setTimeout(() => {
            this.networkType = Network.type;
        }, 3000);*/
    }

}