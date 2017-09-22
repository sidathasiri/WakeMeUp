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

            let currentPositionMarker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });

            var self = this;
            this.map.addListener('click', function(event){
              self.addMarker(event.latLng);
            });

      });
  }

  addMarker(position){
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