import { Component, ViewChild, OnInit, NgModule } from '@angular/core';
import { Environment, GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapOptions, MyLocation, MyLocationOptions } from '@ionic-native/google-maps';
import { LoadingController, Platform } from '@ionic/angular';

@NgModule()
@Component({
  selector: 'app-native-map',
  templateUrl: './native-map.component.html',
  styleUrls: ['./native-map.component.scss'],
})
export class NativeMapComponent implements OnInit {
  
  
  
  @ViewChild('map') mapElement:any;
  private loading:any;
  map: GoogleMap;
  
  constructor(
    private platform: Platform,
    private loadingCtrl:LoadingController
    ) {}

  ngOnInit(){
    this.mapElement = this.mapElement.nativeElement;

    this.mapElement.style.width = this.platform.width()+ 'px';
    this.mapElement.style.height = this.platform.height() + 'px';

    this.loadMap();
  }

  async loadMap(){
    this.loading = await this.loadingCtrl.create({message:"Por favor, aguarde..."});
    await this.loading.present();

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': '',
      'API_KEY_FOR_BROWSER_DEBUG': ''
    });

    const mapOptions: GoogleMapOptions = {
      zoom:false,
    }

    this.map = GoogleMaps.create(this.mapElement, mapOptions);

    try {
      this.addOriginMarker();
    } catch (error) {
      
    }
  };

  async addOriginMarker(){
    try {
      const locationOptions: MyLocationOptions ={
        enableHighAccuracy: true
      }
      const mylocation: MyLocation = await this.map.getMyLocation(locationOptions);

      this.map.moveCamera({
        target: mylocation.latLng,
        tilt: 60,
        zoom:18,
        bearing: 140
      });

      this.map.addMarkerSync({
        title:'Origin',
        icon:'#000',
        animation:GoogleMapsAnimation.DROP,
        position:mylocation.latLng
      });

    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
      
  }

}
