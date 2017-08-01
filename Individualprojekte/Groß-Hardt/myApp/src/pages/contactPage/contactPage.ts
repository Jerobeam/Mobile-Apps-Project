import { Component, NgZone } from '@angular/core';

import { NavController, ToastController, AlertController } from 'ionic-angular';

import { Utilities } from '../../app/utilities';

import { Contacts, Contact, ContactField, ContactName } from 'ionic-native';

@Component({
  selector: 'page-contactPage',
  templateUrl: 'contactPage.html'
})

export class ContactPage {

  selection: string = "myContacts";
  contactArray: any;

  contactInfo = {
    lastname: "",
    firstname: "",
    mobile: ""
  };

  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, public navCtrl: NavController, public zone: NgZone, private utilities: Utilities) {
    Contacts.find(['displayName']).then((allContacts) => {
      this.contactArray = allContacts;
      console.log(this.contactArray);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  showConfirm(id) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Contact?',
      message: 'Are you sure you want to delete this contact?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeContact(id);
          }
        }
      ]
    });
    confirm.present();
  }

  removeContact(idMatch) {
    Contacts.find(['displayName']).then((allContacts) => {
      for (let i of allContacts) {
        if (i.id == idMatch) {
          i.remove().then(() => {
            console.log("removed");
            this.presentToast("Deleted " + i.name.formatted);
            Contacts.find(['displayName']).then((allContacts) => {
              this.contactArray = allContacts;
              console.log(this.contactArray);
            });
          });
        }
      }
    });
  }

  createContact() {
    let contact: Contact = Contacts.create();
    contact.name = new ContactName(null, this.contactInfo.lastname, this.contactInfo.firstname);
    contact.phoneNumbers = [new ContactField('mobile', this.contactInfo.mobile)];
    /*contact.name = new ContactName(null,"Test", "Person");
    contact.phoneNumbers = [new ContactField('mobile', "123345")];*/
    contact.save().then(
      () => {
        console.log('Contact saved!', contact);
        this.presentToast("Contact saved");
        Contacts.find(['displayName']).then((allContacts) => {
          this.contactArray = allContacts;
          console.log(this.contactArray);
          this.selection = "myContacts";
        });
      },
      (error: any) => console.error('Error saving contact.', error)
    );
  }
}

