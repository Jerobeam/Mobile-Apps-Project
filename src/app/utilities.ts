/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class Utilities {

  resolutions = [
    { name: "Running", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, activeDays: [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0
      , 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
      1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
      0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1], lastActivity: "2017-06-21", secondLastActivity: "2017-06-15", iconUrl: "assets/images/running-icon.jpg" },
    { name: "Stop Smoking", isSingleActivity: true, isPreconfigured: true, isActive: true, isDone: false, iconUrl: "assets/images/running-icon.jpg" },
    { name: "Learn Spanish", isSingleActivity: true, isPreconfigured: true, isActive: true, isDone: true, iconUrl: "assets/images/running-icon.jpg" },
    { name: "Lose Weight", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, lastActivity: "2017-06-18", secondLastActivity: "2017-06-07",
      iconUrl: "assets/images/running-icon.jpg" },
    { name: "Football", isSingleActivity: false, isPreconfigured: false, isActive: true, isDone: true , activeDays: [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0,
      1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0,
      1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1 , 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1,
      0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1], lastActivity: "2017-06-20", secondLastActivity: "2017-06-06", iconUrl: "assets/images/running-icon.jpg"},
    { name: "Socialize", isSingleActivity: false, isPreconfigured: true, isActive: false, isDone: false, contacts: [], iconUrl: "assets/images/running-icon.jpg" }
  ];

  getResolutions() {
    return this.resolutions;
  }

  constructor() {

  }

}



