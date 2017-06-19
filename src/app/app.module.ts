import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { Home } from '../pages/home/home.component';
import { ActivitydetailsComponent } from '../pages/activitydetails/activitydetails.component';
import { CreateResolutionComponent } from '../pages/createResolution/createResolution.component';
import { ManageResolutionsComponent } from '../pages/manageResolutions/manageResolutions.component';
import { EditResolutionComponent } from '../pages/editResolution/editResolution.component';
import { AddContactsComponent } from '../pages/addContacts/addContacts.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { Date } from './pipes/date';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    Home,
    ActivitydetailsComponent,
    CreateResolutionComponent,
    ManageResolutionsComponent,
    EditResolutionComponent,
    AddContactsComponent,
    LoginComponent,
    RegisterComponent,

    //pipes
    Date
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    ActivitydetailsComponent,
    CreateResolutionComponent,
    ManageResolutionsComponent,
    EditResolutionComponent,
    AddContactsComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
