/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class Utilities {
  batteryState: string;
  plugged :string;
  latitude: any;
  longitude: any;
  
  constructor() {
    
  }

  setBattery(state){
      this.batteryState = state;
  }
}