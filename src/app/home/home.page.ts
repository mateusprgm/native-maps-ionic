import { Component, ViewChild } from '@angular/core';
import { Environment, GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapOptions, MyLocation } from '@ionic-native/google-maps';
import { LoadingController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDAga47tGm5Fh_KZ9I5VRr_a20Ikx-2YPc',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDAga47tGm5Fh_KZ9I5VRr_a20Ikx-2YPc'
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
      const mylocation: MyLocation = await this.map.getMyLocation();

      this.map.moveCamera({
        target: mylocation.latLng,
        zoom:18
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
