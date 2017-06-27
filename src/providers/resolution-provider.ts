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
    allUsers: Array<any>;
    customResolutions: Array<any>;


    constructor(public utilities: Utilities) {
        this.getUsers();
    }

    updateResolutionStatus(toState: any, resolutionID, data: any): any {
        if (toState == "active") {
            return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions/' + resolutionID).set(
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
      return firebase.database().ref('users/' + this.utilities.user.uid + '/activeResolutions').once('value', snapshot => {
        let counter = 0;
        for (let i in snapshot.val()) {
          this.activeResolutions[counter] = snapshot.val()[i];
          this.activeResolutions[counter].id = i;
          counter++;
          if(snapshot.val()[i].isRecurring){
            this.noRecurringResolutions = false;
          }else{
            this.noSingleResolutions = false;
          }
        }
      })
    }

    getUsers() {
        return firebase.database().ref('users').once('value').then((snapshot) => {
            let userArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                userArray[counter] = snapshot.val()[i];
                userArray[counter].id = i;
                counter++;
            }
            this.allUsers = userArray;
        });
    }
}
