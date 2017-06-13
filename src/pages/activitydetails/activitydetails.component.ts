import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-activitydetails.component',
  templateUrl: 'activitydetails.component.html',
})
export class ActivitydetailsComponent implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  activity: any;

  ngOnInit(){
    this.activity = this.navParams.get('activity');
    console.log(this.activity);
    console.log("Test");
  }
}
