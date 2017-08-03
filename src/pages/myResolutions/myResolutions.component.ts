import {Component} from '@angular/core';
import {NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import {ResolutionDetailsComponent} from '../resolutionDetails/resolutionDetails.component';
import {ManageResolutionsComponent} from '../manageResolutions/manageResolutions.component';
import {Utilities} from '../../app/utilities';
import {ResolutionProvider} from '../../providers/resolution-provider';
import firebase from 'firebase';
import {AuthData} from '../../providers/auth-data';
import {LoginComponent} from '../../pages/login/login.component';


@Component({
  selector: 'page-myResolutions',
  templateUrl: 'myResolutions.component.html',
  providers: [ResolutionProvider]
})
export class MyResolutions{
  loadingElement: any;
  recurrance: string = "all";

  constructor(public loadingCtrl: LoadingController,
              public navCtrl: NavController,
              public utilities: Utilities,
              public resolutionProvider: ResolutionProvider,
              public actionSheetCtrl: ActionSheetController,
              public authData: AuthData) {}


  ionViewWillEnter() {
    this.showLoadingElement();
    this.utilities.setUserData().then(() => {
      this.resolutionProvider.getActiveResolutions().then(() => {
        this.loadingElement.dismiss();
      })
    });
  }

  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios'
    })
    this.loadingElement.present();
  }

  goToPage(event, resolution) {
    this.navCtrl.push(ResolutionDetailsComponent, {resolution: resolution});
  }

  doneResolutionToday(event, resolution) {
    event.stopPropagation();
    resolution.secondLastActivity = resolution.lastActivity;
    resolution.lastActivity = this.utilities.currentDayString;
    resolution.activeDays[this.utilities.currentDayNumber] = true;
    this.resolutionProvider.updateResolution(resolution.id, {
      secondLastActivity: resolution.secondLastActivity,
      lastActivity: resolution.lastActivity,
      activeDays: resolution.activeDays
    });
  }

  doneSingleResolution(event, resolution) {
    event.stopPropagation();
    resolution.isDone = true;
    firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolution.id + '/').update({
      isDone: resolution.isDone
    });
  }

  goToPageManageResolutions() {
    this.navCtrl.push(ManageResolutionsComponent);
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
