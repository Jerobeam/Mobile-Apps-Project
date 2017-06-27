import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { MyResolutions } from "../myResolutions/myResolutions.component";
import { Utilities } from "../../app/utilities";


@Component({
  selector: 'page-register',
  templateUrl: 'register.component.html',
  providers: [AuthData]
})
export class RegisterComponent {

  public signupForm;
  public passwordGroup;
  gender: string = '';
  // team: string = '';
  // teams: any = [];
  // relevantTeams = this.utilities.allTeams;
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  birthdayChanged: boolean = false;
  genderChanged: boolean = false;
  // teamChanged: boolean = false;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  passwordConfirmChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController,
    public authData: AuthData,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public utilities: Utilities) {
    this.signupForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      birthday: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      passwords: formBuilder.group({
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
        passwordConfirm: ['', Validators.compose([Validators.required])]
      }, { validator: this.matchPassword })
    });
    this.passwordGroup = this.signupForm.controls.passwords;
  }

  matchPassword(group) {
    let password = group.controls.password;
    let confirm = group.controls.passwordConfirm;
    if (!(password.value === confirm.value)) {
      return { "incorrectConfirm": true };
    }
    return null;
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  genderSelectChanged(input) {
    this.gender = input;
    this.genderChanged = true;
  }

  startsWithACapital(c: FormControl) {
    let NAME_REGEXP = new RegExp("[A-Z]");
    if (!NAME_REGEXP.test(c.value.charAt(0))) {
      return { "incorrectNameFormat": true }
    }
    let field = "firstname";
    return null;
  }

  isAMail(c: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
      return { "incorrectMailFormat": true };
    }

    return null;
  }

  signupUser() {
    this.submitAttempt = true;

    // if (!this.signupForm.valid || !this.gender || !this.team) {
    if (!this.signupForm.valid || !this.gender) {
      console.log(this.signupForm.value);
      console.log("gender: " + this.gender);
      // console.log("team: " + this.team);
    } else {
      /*window["plugins"].OneSignal.getIds(ids => {
        console.log('getIds: ' + JSON.stringify(ids));

      });*/
      this.utilities.setInRegister();
      this.authData.signupUser(
        this.signupForm.value.email,
        this.passwordGroup.value.password,
        this.signupForm.value.firstname,
        this.signupForm.value.lastname,
        this.signupForm.value.birthday,
        this.gender,
        "0",
      ).then(() => {
        //this.utilities.addPlayerToTeam(this.team, this.utilities.user.uid);
        this.showVerificationAlert();
      }, (error) => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          message: this.authData.getErrorMessage(error),
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  private showVerificationAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Bitte bestätigen Sie Ihre Email Adresse',
      message: 'Ihnen wurde eine Bestäigungsmail zugesandt. Bitte bestätigen Sie Ihre Mail-Adresse.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(MyResolutions);
            this.utilities.setInRegister();
          }
        }
      ]
    });
    confirm.present();
  }

}
