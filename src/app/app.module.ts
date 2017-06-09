import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ActivitydetailsComponent } from '../pages/activitydetails/activitydetails.component';
import { CreateResolutionComponent } from '../pages/createResolution/createResolution.component';
import { ManageResolutionsComponent } from '../pages/manageResolutions/manageResolutions.component';
import { ManageContactsComponent } from '../pages/manageContacts/manageContacts.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ActivitydetailsComponent,
    CreateResolutionComponent,
    ManageResolutionsComponent,
    ManageContactsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ActivitydetailsComponent,
    CreateResolutionComponent,
    ManageResolutionsComponent,
    ManageContactsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
