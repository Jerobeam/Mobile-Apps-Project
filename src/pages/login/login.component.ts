import { Component } from '@angular/core';

import { NavController, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { MyResolutions } from '../myResolutions/myResolutions.component';
import {RegisterComponent} from "../register/register.component";

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  providers: [AuthData]
})
export class LoginComponent {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public authData: AuthData,
              public formBuilder: FormBuilder,public alertCtrl: AlertController,
              public menuCtrl: MenuController) {


    this.menuCtrl.enable(false, 'mainMenu');

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  loginUser(){
    this.submitAttempt = true;

    if (this.loginForm.valid){
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        this.authData.changePushid(authData.uid);
        this.navCtrl.setRoot(MyResolutions);
      }, error => {
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
  }

  goToSignup(){
    this.navCtrl.push(RegisterComponent);
  }
}
