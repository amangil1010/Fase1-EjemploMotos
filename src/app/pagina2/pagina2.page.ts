import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';


@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
})
export class Pagina2Page implements OnInit {

  map: L.Map;


  constructor() { }
  

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.loadMap();
  }
  
  loadMap() {
    let marker;
    let latitud = 36.67273035536797;
    let longitud = -5.447670196400296;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    marker = L.marker([latitud, longitud]).addTo(this.map);
    L.marker([36.67273035536797, -5.447670196400296]).addTo(this.map).bindPopup('Pisito').openPopup();

        
  }
  

}
