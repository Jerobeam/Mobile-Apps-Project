import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html'
})
export class CreateResolutionComponent {
  public resolution ;


  constructor( public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder ) {
    this.resolution = this.formBuilder.group({
      name: [''],
      type: [''],
      reminder: [''],
      imageUrl:['']
    });
  }
  logForm(){
    console.log(this.resolution.value)
  }


}
