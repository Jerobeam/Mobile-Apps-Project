import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { CreateResolutionComponent } from '../createResolution/createResolution.component';
import { EditResolutionComponent } from '../editResolution/editResolution.component';
import { AddContactsComponent } from '../addContacts/addContacts.component';
import { Utilities } from '../../app/utilities';
import { ResolutionProvider } from '../../providers/resolution-provider';
import { AuthData } from '../../providers/auth-data';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { MapData } from "../../app/mapData";
import {LoginComponent} from '../../pages/login/login.component';

@Component({
  selector: 'page-manageResolutions',
  templateUrl: 'manageResolutions.component.html',
  providers: [AuthData, ResolutionProvider, MapData]
})
export class ManageResolutionsComponent {

  selection = "preconfigured";
  loadingElement: any;

  constructor(
    public mapData: MapData,
    public loadingCtrl: LoadingController,
    public resolutionProvider: ResolutionProvider,
    public utilities: Utilities,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public authData: AuthData,
    public toastCtrl: ToastController) {
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

  getAmountOfCustomResolutions(){
    let counter = 0;
    for(let i of this.resolutionProvider.allResolutions){
      if(!i.isPreconfigured){
        counter = counter + 1;
      }
    }
    return counter;
  }
  
  isActive(resolution) {
    for (let i of this.resolutionProvider.activeResolutions) {
      if (i.id == resolution.id) {
        return true;
      }
    }
    return false;
  }

  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loadingElement.present();
  }

  ionViewWillEnter() {
    this.showLoadingElement();
    this.utilities.setUserData();
    // this.resolutionProvider.getPreconfiguredResolutions().then(() => {
    //   this.resolutionProvider.getCustomResolutions();
    // });
    this.resolutionProvider.getActiveResolutions();
    this.loadingElement.dismiss();
  }


  showToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  showRemovalConfirmationAlert(event, resolutionItem) {
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: 'Remove Resolution?',
      message: 'Do you want to deactivate this resolution? Your progress will be lost!',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeFromActiveResolutions(resolutionItem).then(() => {
              this.loadingElement.dismiss();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  addToActiveResolutions(event, resolutionItem) {
    event.stopPropagation();
    if (resolutionItem.isRecurring) {
      resolutionItem.activeDays = new Array(this.utilities.amountOfDaysInCurrentYear);
      resolutionItem.activeDays.fill(false);
    } else {
      resolutionItem.activeDays = "";
    }
    if (resolutionItem.name == "Socialize") {
      if(this.utilities.cordova) {
        this.navCtrl.push(AddContactsComponent, {activity: resolutionItem});
      }else{
        let alert = this.alertCtrl.create({
          message: "Access to your contacts is only possible on Android or iOS",
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present()
      }
    }
    else {
      this.showLoadingElement();
      let resolutionData;
      if (resolutionItem.iconUrl != undefined) {
        resolutionData = {
          id: resolutionItem.id,
          // name: resolutionItem.name,
          lastActivity: "",
          activeDays: resolutionItem.activeDays,
          // isRecurring: resolutionItem.isRecurring,
          reminderFrequency: 1,
          // iconUrl: resolutionItem.iconUrl
        }
      } else {
        resolutionData = {
          id: resolutionItem.id,
          // name: resolutionItem.name,
          lastActivity: "",
          activeDays: resolutionItem.activeDays,
          // isRecurring: resolutionItem.isRecurring,
          reminderFrequency: 1
        }
      }
      this.resolutionProvider.updateResolutionStatus(
        "active",
        resolutionItem.id, resolutionData).then(() => {
          if (this.utilities.cordova) {
            if (resolutionItem.isPreconfigured) {
              for (let i of this.mapData.elements) {
                if (i.tags.amenity == resolutionItem.category){
                  this.utilities.addGeofence(resolutionItem.id, "Location: " + i.tags.name
                    , "Remember your Resolution '" + resolutionItem.name + "'!", i.lat, i.lon)
                    .then(() => {
                      this.resolutionProvider.getActiveResolutions();
                    });
                }

              }
            } else {
              this.resolutionProvider.getActiveResolutions();
            }

            this.utilities.scheduleResolutionNotifications(resolutionItem, 3);
            this.loadingElement.dismiss();
          }
          else {
            this.resolutionProvider.getActiveResolutions();
            this.loadingElement.dismiss();
          }
          this.utilities.setUserData();
          this.showToast("Resolution is now active");
        });
    }
  }

  removeFromActiveResolutions(resolutionItem) {
    this.showLoadingElement();
    this.utilities.setUserData();
    if (this.utilities.cordova) {
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

    }
    this.resolutionProvider.updateResolutionStatus("inactive", resolutionItem.id, {}).then(() => {
      this.resolutionProvider.getActiveResolutions();
      this.showToast("Resolution is no longer active");
    });
    return Promise.resolve();
  }

  openWindowCreateResolution() {
    this.navCtrl.push(CreateResolutionComponent);
  }

  popPage() {
    this.navCtrl.pop();
  }

  editResolution($event, resolution) {
    this.navCtrl.push(EditResolutionComponent, { resolution: resolution });
  }

  presentLogOutActionSheet(){
    let actionSheetOptions = {
      buttons: [
        {
          text: "Logout",
          icon: "log-out",
          handler: () => {
            this.authData.logoutUser();
            this.navCtrl.setRoot(LoginComponent);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    };
    let actionSheet = this.actionSheetCtrl.create(actionSheetOptions);
    actionSheet.present();
  }
}
