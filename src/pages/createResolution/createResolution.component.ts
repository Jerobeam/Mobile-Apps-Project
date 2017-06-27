import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html'
})
export class CreateResolutionComponent {
  private resolution : FormGroup;

  constructor( public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder ) {
    this.resolution = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
    });
  }
  logForm(){
    console.log(this.resolution.value)
  }


  /*isPreconfigured: boolean =false;
  isRecurring: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  isRecurringMethod(){

  }

  setCustomerRes() {
    console.log(this.resolution)
  }*/









}
