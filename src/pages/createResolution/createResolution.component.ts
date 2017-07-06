import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import { Utilities } from '../../app/utilities';
import {ResolutionProvider} from "../../providers/resolution-provider";

@Component({
  selector: 'page-createResolution',
  templateUrl: 'createResolution.component.html',
  providers: [ResolutionProvider]
})
export class CreateResolutionComponent {
  public resolution ;
  public isRecurringC: boolean=false;



  constructor( public navCtrl: NavController,public utilities: Utilities , public resolutionProvider: ResolutionProvider, public navParams: NavParams, private formBuilder: FormBuilder ) {
    this.resolution = this.formBuilder.group({
      name: [''],
      type: [''],
      imageUrl:['']
    });
  }

  isRecurringMethod(){
    if (this.resolution.value.type == 'Recurring Activity'){
      this.isRecurringC = true;
    } if (this.resolution.value.type == 'Single Activity'){
      this.isRecurringC = false;
    } else{

    }
    console.log(this.isRecurringC)
  }

  createResolution() {
    this.isRecurringMethod();
    console.log(this.resolution.value);
    this.resolutionProvider.createNewCustomResolution(
      {
        isPreconfigured: false,
        isRecurring: this.isRecurringC,
        name: this.resolution.value.name,
        iconUrl: this.resolution.value.imageUrl
      });
  }
}
