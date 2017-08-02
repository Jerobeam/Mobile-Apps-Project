import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Deeplinks } from '@ionic-native/deeplinks';
import { MyApp } from './app.component';
import { MyResolutions } from '../pages/myResolutions/myResolutions.component';
import { ResolutionDetailsComponent } from '../pages/resolutionDetails/resolutionDetails.component';
import { CreateResolutionComponent } from '../pages/createResolution/createResolution.component';
import { ManageResolutionsComponent } from '../pages/manageResolutions/manageResolutions.component';
import { EditResolutionComponent } from '../pages/editResolution/editResolution.component';
import { AddContactsComponent } from '../pages/addContacts/addContacts.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { HttpModule } from '@angular/http';
import { Date } from './pipes/date';
import { Geofence } from '@ionic-native/geofence';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from 'ionic-native';
import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    MyApp,
    MyResolutions,
    ResolutionDetailsComponent,
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
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyResolutions,
    ResolutionDetailsComponent,
    CreateResolutionComponent,
    ManageResolutionsComponent,
    EditResolutionComponent,
    AddContactsComponent,
    LoginComponent,
    RegisterComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geofence,
    Geolocation,
    Deeplinks,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
