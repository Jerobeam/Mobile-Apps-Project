import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {Utilities} from '../app/utilities';
/*
 Generated class for the AuthData provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class AuthData {
  public fireAuth: any;
  public userProfile: any;

  constructor(public utilities: Utilities) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, pushid: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({
          email: email,
          pushid: {},
        });
        firebase.database().ref('users/' + newUser.uid + '/pushid/' + pushid).set(
          true
        );
        this.utilities.user = newUser;
        newUser.sendEmailVerification();
      });
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  changePassword(newPassword: string, passwordOld: string): any {
    let that = this;
    let credentials = firebase.auth.EmailAuthProvider.credential(
      this.utilities.userData.email,
      passwordOld
    );

    return this.fireAuth.currentUser.reauthenticate(credentials).then(function () {
      that.fireAuth.currentUser.updatePassword(newPassword);
    });
  }

  changeEmail(email: string): any {
    return this.fireAuth.currentUser.updateEmail(email).then(function () {
      // Update successful.
    }, function (error) {
      alert(error.message);
    });
  }

  deleteUser(password: string): any {
    let that = this;
    let credentials = firebase.auth.EmailAuthProvider.credential(
      this.utilities.userData.email,
      password
    );

    return this.fireAuth.currentUser.reauthenticate(credentials).then(function () {
      that.fireAuth.currentUser.delete().then(function () {
        // User deleted.
      }, function (error) {
        alert(error.message);
      });
    });
  }

  /*changePushid(userid: string): any {
   window["plugins"].OneSignal.getIds(ids => {
   console.log('getIds: ' + JSON.stringify(ids));
   //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
   return firebase.database().ref('users/' + userid + '/pushid/' + ids.userId).set(
   true
   );
   });
   }*/

  changePushid(userid: string): any {
    if (this.utilities.cordova) {
      window["plugins"].OneSignal.getIds(ids => {
        return firebase.database().ref('users/' + userid + '/pushid/' + ids.userId).set(
          true
        );
      });
    }
  }

  logoutUser(): any {
    if (this.utilities.cordova) {
      window["plugins"].OneSignal.getIds(ids => {
        firebase.database().ref('users/' + this.utilities.user.uid + '/pushid').child(ids.userId).remove().then(() => {
          return this.fireAuth.signOut();
        })
      })
    } else {
      return this.fireAuth.signOut();
    }
  }

  getErrorMessage(error): string {
    let code: string = error.code;
    if (code === "auth/invalid-email") {
      return "The mail address you entered is invalid."
    }
    else if (code === "auth/wrong-password") {
      return "The password you entered is wrong."
    }
    else if (code === "auth/user-not-found") {
      return "No registered user with this mail address."
    }
    else if (code === "auth/internal-error") {
      return "Something went wrong. Please try again later."
    }
    else {
      return error.message;
    }
  }

}
