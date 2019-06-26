import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { NativeMapComponent } from '../components/native-map/native-map.component';

import { GoogleMaps } from '@ionic-native/google-maps';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
    
  ],
  providers:[
    GoogleMaps,
    DeviceOrientation
  ],
  declarations: [HomePage, NativeMapComponent]
})
export class HomePageModule {}
