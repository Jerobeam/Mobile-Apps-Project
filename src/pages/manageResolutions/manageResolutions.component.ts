import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CreateResolutionComponent } from '../createResolution/createResolution.component';
import { AddContactsComponent } from '../addContacts/addContacts.component';
import { Utilities } from '../../app/utilities';
import { ResolutionProvider } from '../../providers/resolution-provider';

@Component({
  selector: 'page-manageResolutions',
  templateUrl: 'manageResolutions.component.html',
  providers: [ResolutionProvider]
})
export class ManageResolutionsComponent {

  selection = "preconfigured";
  activeResolutions = [];

  constructor(public resolutionProvider: ResolutionProvider, public utilities: Utilities, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController) {

  }

  findActiveResolutions() {
    for (let resolution of this.resolutionProvider.allResolutions) {
      console.log(resolution);
      for (let i in this.utilities.userData.activeResolutions) {
        if (resolution.id == i) {
          this.activeResolutions.push(resolution);
        }
      }
    }
  }

  isActive(resolution) {
    for (let i of this.activeResolutions) {
      if (i.id == resolution.id) {
        return true;
      }
    }
    return false;
  }

  ionViewWillEnter() {
    //this.showLoadingElement();
    this.utilities.setUserData();
    this.resolutionProvider.setPreconfiguredResolutions().then(() => {
      this.resolutionProvider.setCustomResolutions(this.utilities.user).then(() => {
        this.findActiveResolutions();
      });
    });
    //this.loadingElement.dismiss();
  }

  showToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  showRemovalConfirmationAlert(resolutionItem, isPreconfigured: boolean) {
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
            this.removeFromActiveResolutions(resolutionItem, isPreconfigured);
          }
        }
      ]
    });
    confirm.present();
  }

  addToActiveResolutions(resolutionItem, isPreconfigured: boolean) {
    if (resolutionItem.name == "Socialize") {
      this.navCtrl.push(AddContactsComponent, { activity: resolutionItem });
    }
    else {
      this.activeResolutions.push(resolutionItem);
      //this.activeResolutionsIDs.push(resolutionItem.id);
      this.utilities.updateResolutionStatus(isPreconfigured, "active", this.utilities.user.uid,
        resolutionItem.id,
        { id: resolutionItem.id, name: resolutionItem.name, lastActivity: "" });
      this.showToast("Resolution is now active and will appear on the home screen");
    }
  }

  removeFromActiveResolutions(resolutionItem, isPreconfigured: boolean) {
    if (resolutionItem.name == "Socialize") {
      resolutionItem.contacts = [];
      console.log("Cleared Array:");
      console.log(resolutionItem.contacts);
    }
    this.utilities.updateResolutionStatus(isPreconfigured, "inactive", this.utilities.user.uid,
      resolutionItem.id,
      { id: resolutionItem.id, name: resolutionItem.name, lastActivity: "" });

    this.activeResolutions = this.activeResolutions.filter((item) => {
      return ((item.id.toLowerCase().indexOf(resolutionItem.id.toLowerCase()) <= -1));
    })
    this.showToast("Resolution is no longer active and was removed from the home screen");
  }

  openWindowCreateResolution() {
    this.navCtrl.push(CreateResolutionComponent);
  }

  popPage() {
    this.navCtrl.pop();
  }
}
