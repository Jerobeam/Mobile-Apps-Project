import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CreateResolutionComponent } from '../createResolution/createResolution.component';
import { AddContactsComponent } from '../addContacts/addContacts.component';
import { LoginComponent } from '../login/login.component';
import { Utilities } from '../../app/utilities';
import { ResolutionProvider } from '../../providers/resolution-provider';
import { AuthData } from '../../providers/auth-data';

@Component({
  selector: 'page-manageResolutions',
  templateUrl: 'manageResolutions.component.html',
  providers: [AuthData, ResolutionProvider]
})
export class ManageResolutionsComponent {

  selection = "preconfigured";

  constructor(public authData: AuthData, public resolutionProvider: ResolutionProvider, public utilities: Utilities, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController) {

  }

  logout() {
    this.authData.logoutUser();
    this.navCtrl.setRoot(LoginComponent);
  }

  //Only used in order to test the method utilities.removeCustomRevolution()
  testRemove(resolutionID) {
    this.resolutionProvider.removeCustomResolution(resolutionID).then(() => {
      this.utilities.setUserData();
      this.resolutionProvider.getPreconfiguredResolutions().then(() => {
        this.resolutionProvider.getCustomResolutions();
      });
      this.resolutionProvider.getActiveResolutions();
    });
  }

  isActive(resolution) {
    for (let i of this.resolutionProvider.activeResolutions) {
      if (i.id == resolution.id) {
        return true;
      }
    }
    return false;
  }

  ionViewWillEnter() {
    //this.showLoadingElement();
    this.utilities.setUserData();
    this.resolutionProvider.getPreconfiguredResolutions().then(() => {
      this.resolutionProvider.getCustomResolutions();
    });
    this.resolutionProvider.getActiveResolutions();
    //this.loadingElement.dismiss();
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
      message: 'Do you want to deactivate this resolution? Your progress will be lost!',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //this.showToast("Aborted");
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
    if (resolutionItem.isRecurring) {
      resolutionItem.activeDays = new Array(this.utilities.amountOfDaysInCurrentYear);
      resolutionItem.activeDays.fill(false);
    } else {
      resolutionItem.activeDays = "";
    }
    if (resolutionItem.name == "Socialize") {
      this.navCtrl.push(AddContactsComponent, { activity: resolutionItem });
    }
    else {
      this.resolutionProvider.updateResolutionStatus("active", resolutionItem.id,
        { id: resolutionItem.id, name: resolutionItem.name, lastActivity: "", activeDays: resolutionItem.activeDays, isRecurring: resolutionItem.isRecurring, reminderFrequency: 3 })
        .then(() => {
          this.utilities.addGeofence(resolutionItem.id, "Test", "Sie sind bei X", 49.474797, 8.535164).then(() => {
            this.resolutionProvider.getActiveResolutions();
          });
          this.utilities.scheduleResolutionNotifications(resolutionItem);
          this.utilities.setUserData();
          this.showToast("Resolution is now active");
        });
    }
  }

  removeFromActiveResolutions(resolutionItem) {
    this.utilities.setUserData();
    for (let i of this.resolutionProvider.activeResolutions) {
      if (i.id == resolutionItem.id) {
        for (let j in i.geofences) {
          this.utilities.removeGeofence(j, resolutionItem.id);
        }
        for (let k in i.scheduledNotifications) {
          this.utilities.cancelPushNotification(k, resolutionItem.id);
        }
      }
    }
    this.resolutionProvider.updateResolutionStatus("inactive", resolutionItem.id, {}).then(() => {
      this.resolutionProvider.getActiveResolutions();
      this.showToast("Resolution is no longer active");
    });
  }

  openWindowCreateResolution() {
    this.navCtrl.push(CreateResolutionComponent);
  }

  popPage() {
    this.navCtrl.pop();
  }
}