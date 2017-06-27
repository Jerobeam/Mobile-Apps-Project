import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ResolutionProvider {

    allResolutions: Array<any>;
    allUsers: Array<any>;
    customResolutions: Array<any>;

    constructor() {
        this.getUsers();
    }

    updateResolutionStatus(toState: any, userID: any, resolutionID, data: any): any {
        if (toState == "active") {
            return firebase.database().ref('users/' + userID + '/activeResolutions/' + resolutionID).set(
                data
            );
        }
        else if (toState == "inactive") {
            return firebase.database().ref('users/' + userID + '/activeResolutions/' + resolutionID).remove();
        }
    }

    createNewCustomResolution(data, userID) {
        return firebase.database().ref('users/' + userID + '/customResolutions/').child(this.makeID()).set({
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

    removeCustomResolution(resolutionID, userID) {
        return firebase.database().ref('users/' + userID + '/customResolutions/').child(resolutionID).remove().then(() => {
            firebase.database().ref('users/' + userID + '/activeResolutions/').child(resolutionID).remove();
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

    getCustomResolutions(user) {
        return firebase.database().ref('users/' + user.uid + '/customResolutions').once('value', snapshot => {
            let counter = this.allResolutions.length;
            for (let i in snapshot.val()) {
                this.allResolutions[counter] = snapshot.val()[i];
                this.allResolutions[counter].id = i;
                counter++;
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
