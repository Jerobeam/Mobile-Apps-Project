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
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  birthdayChanged: boolean = false;
  genderChanged: boolean = false;
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

  isAMail(c: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
      return { "incorrectMailFormat": true };
    }

    return null;
  }

  signupUser() {
    this.submitAttempt = true;

    if (this.signupForm.valid) {
      if(this.utilities.cordova){
        window["plugins"].OneSignal.getIds(ids => {
          this.utilities.setInRegister();
          this.authData.signupUser(
            this.signupForm.value.email,
            this.passwordGroup.value.password,
            ids.userId
          ).then(() => {
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
        });
      }else{
        this.utilities.setInRegister();
        this.authData.signupUser(
          this.signupForm.value.email,
          this.passwordGroup.value.password,
          "0"
        ).then(() => {
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
      }
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  private showVerificationAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Please confirm your mail address',
      message: 'Send another confirmation mail?',
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
