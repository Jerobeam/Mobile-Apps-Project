import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ResolutionProvider {

    allResolutions: Array<any>;
    allUsers: Array<any>;

    constructor() {
        this.setUsers();
    }

    setPreconfiguredResolutions() {
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

    setCustomResolutions(user) {
        return firebase.database().ref('users/' + user.uid + '/customResolutions').once('value', snapshot => {
            let counter = this.allResolutions.length;
            for (let i in snapshot.val()) {
                this.allResolutions[counter] = snapshot.val()[i];
                this.allResolutions[counter].id = i;
                counter++;
            }
        })
    }

    setUsers() {
        return firebase.database().ref('users').once('value').then((snapshot) => {
            let userArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                userArray[counter] = snapshot.val()[i];
                userArray[counter].id = i;
                counter++;
            }
            this.allUsers = userArray;
            this.allUsers = _.sortBy(this.allUsers, "lastname");
        });
    }
}
