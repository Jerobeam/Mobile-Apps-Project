import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { Contacts } from 'ionic-native';
import { ResolutionProvider } from '../../providers/resolution-provider'
//import { Contacts, Contact, ContactField, ContactName } from 'ionic-native';

@Component({
    selector: 'page-addContacts',
    templateUrl: 'addContacts.component.html',
    providers: [ResolutionProvider]
})
export class AddContactsComponent {

    contactArray: any;
    displayArray: any;
    resolutionItem: any;
    selectedContacts = [];

    constructor(public resolutionProvider: ResolutionProvider, public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public utilities: Utilities) {
        if (this.utilities.cordova) {
            Contacts.find(['displayName']).then((allContacts) => {
                this.displayArray = allContacts;
                this.contactArray = allContacts;
                console.log(this.contactArray);
            });
        }
    }

    ionViewWillEnter() {
        this.resolutionItem = this.navParams.get('activity');
    }

    getItems(ev) {
        let value = ev.target.value;
        this.displayArray = this.contactArray;
        // if the value is an empty string don't filter the items
        if (value && value.trim() != '') {
            this.displayArray = this.contactArray.filter((item) => {
                return ((item.name.formatted.toLowerCase().indexOf(value.toLowerCase()) > -1) || (item.name.formatted.toLowerCase().indexOf(value.toLowerCase()) > -1));
            })
        }
    }

    addContactToList(contactItem) {
        this.selectedContacts.push(contactItem);
        console.log("Selected Contacts:");
        console.log(this.selectedContacts);
    }

    removeContactFromList(contactItem) {
        let value = contactItem.name.formatted;
        this.selectedContacts = this.selectedContacts.filter((item) => {
            return ((item.name.formatted.toLowerCase().indexOf(value.toLowerCase()) <= -1));
            // || (item.name.formatted.toLowerCase().indexOf(value.toLowerCase()) < -1)
        })
        console.log("Selected Contacts:");
        console.log(this.selectedContacts);
    }

    contactIsInArray(contactItem) {
        let counter = 0;
        if (this.selectedContacts.length > 0) {
            for (let item of this.selectedContacts) {
                //compare names? maybe comparing phone numbers makes more sense
                if (item.name.formatted == contactItem.name.formatted) {
                    counter++;
                }
            }
            if (counter > 0) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    confirm() {
        this.resolutionItem.contacts = this.selectedContacts;
        /*this.resolutionProvider.updateResolutionStatus("active",this.resolutionItem.id,
            { id: this.resolutionItem.id, name: this.resolutionItem.name, lastActivity: "", contacts: this.selectedContacts });
        */

        this.resolutionProvider.updateResolutionStatus(
            "active",
            this.resolutionItem.id,
            {
                id: this.resolutionItem.id,
                // name: this.resolutionItem.name,
                lastActivity: "",
                activeDays: this.resolutionItem.activeDays,
                // isRecurring: this.resolutionItem.isRecurring,
                reminderFrequency: 1,
                contacts: this.selectedContacts
            }).then(() => {
                if (this.utilities.cordova) {
                    this.utilities.addGeofence(this.resolutionItem.id, "Test", "Sie sind bei X", 49.474797, 8.535164).then(() => {
                        this.resolutionProvider.getActiveResolutions();
                    });
                    this.utilities.scheduleResolutionNotifications(this.resolutionItem, 3);
                }
                else {
                    this.resolutionProvider.getActiveResolutions();
                }
                this.utilities.setUserData();
                this.showToast("Resolution is now active");
                this.navCtrl.pop();
            });
    }

    showToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000
        });
        toast.present();
    }

    popPage() {
        this.navCtrl.pop();
    }
}
