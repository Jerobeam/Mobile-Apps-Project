import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../app/utilities';

@Component({
    selector: 'page-addContacts',
    templateUrl: 'addContacts.component.html'
})
export class AddContactsComponent {

    constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: Utilities) {

    }

    resolutionItem: any;

    ionViewWillEnter() {
        this.resolutionItem = this.navParams.get('activity');
    }

}
