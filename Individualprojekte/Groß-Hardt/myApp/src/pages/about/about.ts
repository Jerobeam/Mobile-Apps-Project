import { Component } from '@angular/core';

import { Utilities } from '../../app/utilities';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class About {

    constructor(private utilities: Utilities) {

    }
}

