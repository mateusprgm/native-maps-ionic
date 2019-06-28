import { Component, ViewChild, OnInit, NgModule } from '@angular/core';
import { Environment, GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapOptions, MyLocation, MyLocationOptions, ILatLng, KmlOverlay, Circle, CircleOptions, LatLng, MarkerIcon, GoogleMapsEvent } from '@ionic-native/google-maps';
import { LoadingController, Platform } from '@ionic/angular';
import { DeviceOrientation, DeviceOrientationCompassOptions } from '@ionic-native/device-orientation/ngx';
import { DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { Observable } from 'rxjs';


declare var google: any;

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
  

  private directionsService = new google.maps.DirectionsService();
  
  constructor(
    private platform: Platform,
    private loadingCtrl:LoadingController,
    private deviceOrientation: DeviceOrientation
    ) {
      
    }

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
    
      console.log(this.map);
      console.log(google.map);
    

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

      let text = ["Current your location:\n",
                  "latitude:" + mylocation.latLng.lat.toFixed(3),
                  "longitude:" + mylocation.latLng.lng.toFixed(3),
                  "speed:" + mylocation.speed,
                  "time:" + mylocation.time,
                  "bearing:" + mylocation.bearing].join("\n");

      
      let icon: MarkerIcon = {
        url: '../../assets/icon/navigation.png',
        size: {
          width: 32,
          height: 24
        }
      };
      var marker = this.map.addMarkerSync({
        title: text,
        icon: "#000",//'../../assets/icon/navigation.png',
        animation: GoogleMapsAnimation.DROP,
        position: mylocation.latLng
      });

      
      var marker1 = this.map.addMarkerSync({
        title:"oi",
        icon:"#000",
        position: {lat: -15.410046700000001, lng: -48.109999999999995},
        
      })
      let i = 0;
      this.map.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(res => {
        setInterval(function(){
          var lc = new google.maps.LatLng({lat: -15.410046700000001 -(-15.410046700000001/100*i), lng: -48.109999999999995-(-48.109999999999995/100*i)});
          marker.setPosition(lc);
          i++;
        },20);
        console.log("mecheu");
      });
      
         
      await marker1.setRotation(270);
      // marker.showInfoWindow();

      await this.directionsService.route({
        origin: mylocation.latLng,
        destination: marker1.getPosition(),
        travelMode:'DRIVING'
      }, async results =>{
        
        const steps = new Array<ILatLng>();
        const routes = results.routes[0].overview_path;

        for (let index = 0; index < routes.length; index++) {
          steps[index] = {
            lat:routes[index].lat(),
            lng:routes[index].lng()
          }

          // var marker1 = this.map.addMarkerSync({
          //   title:"oi",
          //   icon:"#000",
          //   position: {lat: routes[index].lat(), lng: routes[index].lng()},
            
          // })
          
        }
        await this.map.moveCamera({
          target: steps,
          tilt: 60,
          // zoom:18,
          duration: 5000,
          
        });
        
        await this.map.addPolyline({
          points: steps,
          color:'#000',
          width: 10
        })

        await this.animation(steps, marker);

      })

      const optionsCompass : DeviceOrientationCompassOptions = {
         frequency: 20,
      }
      
       var subscription = this.deviceOrientation.watchHeading(optionsCompass).subscribe(
        (data: DeviceOrientationCompassHeading) => {
          
           
         
          
            // marker.setRotation(data.magneticHeading);
            // this.map.moveCamera({
            //   target: mylocation.latLng,
            //   tilt: 60,
            //   // zoom:18,
            //   duration: 20,
            //   bearing: 360
            // });
           
            
          

          
        
         
        
        },
        (error: any) => console.log(error)
      );
      
     
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
      
  }

  getCurrentLocation() {
    let locationObs: Observable<any>;
    

    if (navigator.geolocation) {

      locationObs = Observable.create(
        obs=>{
            navigator.geolocation.getCurrentPosition(function(position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
            
              let location = new google.maps.LatLng(lat, lng);
              
              obs.next(location);
              obs.complete();
            }),function error(err) {
              console.warn('ERROR(' + err.code + '): ' + err.message);
            },{maximumAge:10000, timeout:5000, enableHighAccuracy: true};
        }
      ) 

      return locationObs;
     }
  }

async  animation(steps, marker){
    console.log(marker);
    let i =0;
    
    
    await this.getCurrentLocation().subscribe(origin=>{
      

      
      

      let time = setInterval(r=>{
        

        
        this.map.setCameraZoom(10);

        marker.setPosition(steps[i]);
        this.map.setCameraTarget(steps[i]);
        
        i++;
        if(i >= steps.length){
          clearInterval(time);
        }
      },20)
      

      
    })
  }

  spin
  

}
