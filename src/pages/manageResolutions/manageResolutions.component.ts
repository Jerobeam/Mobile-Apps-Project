import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CreateResolutionComponent } from '../createResolution/createResolution.component';
import { AddContactsComponent } from '../addContacts/addContacts.component';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-manageResolutions',
  templateUrl: 'manageResolutions.component.html'
})
export class ManageResolutionsComponent {

  selection = "preconfigured";

  constructor(public utilities: Utilities, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController) {

  }

  showToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  showRemovalConfirmationAlert(resolutionItem) {
    let confirm = this.alertCtrl.create({
      title: 'Remove Resolution?',
      message: 'Do you want to remove this resolution? Your progress will be lost!',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.showToast("Aborted");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeFromActiveResolutions(resolutionItem);
          }
        }
      ]
    });
    confirm.present();
  }

  addToActiveResolutions(resolutionItem) {
    if (resolutionItem.name == "Socialize") {
      this.navCtrl.push(AddContactsComponent, { activity: resolutionItem });
    }
    else {
      resolutionItem.isActive = true;
      this.showToast("Resolution is now active and will appear on the home screen");
    }
  }

  removeFromActiveResolutions(resolutionItem) {
    if(resolutionItem.name == "Socialize"){
      resolutionItem.contacts = [];
      console.log("Cleared Array:");
      console.log(resolutionItem.contacts);
    }
    this.showToast("Resolution is no longer active and was removed from the home screen");
    resolutionItem.isActive = false;
  }

  openWindowCreateResolution() {
    this.navCtrl.push(CreateResolutionComponent);
  }
}
