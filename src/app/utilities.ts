/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class Utilities {

  resolutions = [
    { name: "Running", isPreconfigured: true, isActive: false, isDone: false },
    { name: "Stop Smoking", isPreconfigured: true, isActive: true, isDone: false },
    { name: "Lose Weight", isPreconfigured: true, isActive: false, isDone: false },
    { name: "1 nice Activity", isPreconfigured: false, isActive: false, isDone: false },
    { name: "Fußball", isPreconfigured: false, isActive: true, isDone: true },
    { name: "Socialize", isPreconfigured: true, isActive: false, isDone: true }
  ];

  getResolutions() {
    return this.resolutions;
  }
  constructor() {

  }

}



