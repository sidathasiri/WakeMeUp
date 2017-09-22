import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement
  map: any;
  marker: any = null;
  currentPositionMarker: any = null;
  lockBtnText: String = "Lock Marker";

  circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'blue',
      fillOpacity: 0.5,
      scale: 7.5,
      strokeColor: 'white',
      strokeWeight: 2
    };

  constructor(public navCtrl: NavController, private geolocation: Geolocation) {
    
  }

  ionViewDidLoad(){
    this.initMap();
  }

  initMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement);
    const subscription = this.geolocation.watchPosition().subscribe(
      position => {
            console.log(position.coords.longitude + ' ' + position.coords.latitude);

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map.setOptions(mapOptions);

            this.currentPositionMarker = new google.maps.Marker({
              map: this.map,
              position: latLng,
              icon: this.circle
            });

            var self = this;
            this.map.addListener('click', function(event){
              self.addMarker(event.latLng);
            });
            

      });
  }

  addMarker(position){
    if(this.lockBtnText == "Lock Marker"){
      if(this.marker)
        this.marker.setMap(null);

      this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
      this.map.panTo(position);
    }
  }

  removeMarker(){
    if(this.marker && this.lockBtnText == "Lock Marker")
      this.marker.setMap(null);
  }

  myLocation(){
    this.map.panTo(this.currentPositionMarker.position);
  }

  destination(){
    if(!this.marker)
      return;
    
    if(this.marker.getMap())
      this.map.panTo(this.marker.position);
    
    else
      return;
    
  }

  lockBtn(){
    console.log("log btn");
    if(this.lockBtnText == "Lock Marker")
      this.lockBtnText = "Unlock Marker";
    else
      this.lockBtnText = "Lock Marker";
  }

  
}