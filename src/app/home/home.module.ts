import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { NativeMapComponent } from '../components/native-map/native-map.component';
import { GoogleMaps } from '@ionic-native/google-maps';

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
  ],
  declarations: [HomePage, NativeMapComponent]
})
export class HomePageModule {}
