import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home} from '../pages/home/home';
import { Battery } from '../pages/battery/battery';
import { CameraPage } from '../pages/cameraPage/cameraPage';
import { Orientation } from '../pages/orientation/orientation';
import { Geolocations } from '../pages/geolocations/geolocations';
import { NetworkInfo } from '../pages/networkInfo/networkInfo';
import { About } from '../pages/about/about';
import { ContactPage } from '../pages/contactPage/contactPage';

@NgModule({
  declarations: [
    MyApp,
    Battery,
    CameraPage,
    Orientation,
    Geolocations,
    About,
    Home,
    NetworkInfo,
    ContactPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Battery,
    CameraPage,
    Orientation,
    Geolocations,
    About,
    Home,
    NetworkInfo,
    ContactPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
