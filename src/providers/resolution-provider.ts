import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Utilities } from '../app/utilities';

@Injectable()
export class ResolutionProvider {

    allResolutions: Array<any>;
    activeResolutions: Array<any> = [];
    noRecurringResolutions: boolean = true;
    noSingleResolutions: boolean = true;


    constructor(public utilities: Utilities) {
        // this.getActiveResolutions();
    }

    updateResolutionStatus(toState: any, resolutionID, data: any): any {
        if (toState == "active") {
            return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolutionID).update(
                data
            );
        }
        else if (toState == "inactive") {
            return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolutionID).remove();
        }
    }

    createNewCustomResolution(data) {
        return firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/').child(this.makeID()).set({
            isPreconfigured: data.isPreconfigured,
            iconUrl: data.iconUrl,
            isRecurring: data.isRecurring,
            name: data.name
        });
    }

    updateResolution(resolutionID, data: any): any {
      return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolutionID).update(
        data
      );
    }

    makeID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 26; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    removeCustomResolution(resolutionID) {
        return firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions/').child(resolutionID).remove().then(() => {
            firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/').child(resolutionID).remove();
        });
    }

    getPreconfiguredResolutions() {
      this.allResolutions = [];
        return firebase.database().ref('resolutions').once('value', snapshot => {
            let resolutionArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                resolutionArray[counter] = snapshot.val()[i];
                resolutionArray[counter].id = i;
                counter++;
            }
            this.allResolutions = resolutionArray;
        })
    }

    getCustomResolutions() {
        return firebase.database().ref('users/' + this.utilities.user.uid + '/customResolutions').once('value', snapshot => {
            let counter = this.allResolutions.length;
            for (let i in snapshot.val()) {
                this.allResolutions[counter] = snapshot.val()[i];
                this.allResolutions[counter].id = i;
                counter++;
            }
        })
    }

    getActiveResolutions() {
      this.noRecurringResolutions = true;
      this.noSingleResolutions = true;
      this.activeResolutions = [];
      var that = this;
      return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions').once('value', snapshot => {
        let counter = 0;
        for (let i in snapshot.val()) {
          that.activeResolutions[counter] = snapshot.val()[i];
          that.activeResolutions[counter].id = i;
          counter++;
        }
        that.getPreconfiguredResolutions().then(() => {
          that.getCustomResolutions().then(() => {
            for(let i in that.allResolutions){
              for(let j in that.activeResolutions){
                if(that.allResolutions[i].id == that.activeResolutions[j].id){
                  that.activeResolutions[j].name = that.allResolutions[i].name;
                  that.activeResolutions[j].isRecurring = that.allResolutions[i].isRecurring;
                  that.activeResolutions[j].iconUrl = that.allResolutions[i].iconUrl;
                  if(that.allResolutions[i].isRecurring){
                    that.noRecurringResolutions = false;
                  }else{
                    that.noSingleResolutions = false;
                  }
                }
              }
            }
          });
        });
      })
    }
}
