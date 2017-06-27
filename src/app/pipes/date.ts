/**
 * Created by Sebastian on 20.12.2016.
 */

import {Pipe} from '@angular/core'
import {Utilities} from '../../app/utilities';

@Pipe({
  name: 'date'
})
export class Date {
  constructor(public utilities: Utilities) {
  }

  transform(date) {
    if(date != undefined && date != "") {
      return date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];
    }
  }
}
