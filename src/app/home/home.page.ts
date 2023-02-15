import { Component } from '@angular/core';
import { Moto } from '../moto';

import { FirestoreService } from '../firestore.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  motoEditando: Moto;
  arrayColeccionMotos: any =[{
    id:"",
    data:{} as Moto
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    //crear una tarea vacia
    this.motoEditando={} as Moto;
    this.obtenerListaMoto();
  }



  obtenerListaMoto(){
    this.firestoreService.consultar("motos").subscribe((resultadoConsultaMotos) => {
      this.arrayColeccionMotos = [];
      resultadoConsultaMotos.forEach((datosMotos: any) => {
        this.arrayColeccionMotos.push({
          id:datosMotos.payload.doc.id,
          data: datosMotos.payload.doc.data()
        })
      });
    }) 
  }

  idMotoSelec: string;


  selecMoto(motoSelec) {
    console.log("Moto Seleccionada: ");
    console.log(motoSelec);
    //Fallo de motoSelec
    this.idMotoSelec = motoSelec.id;
    this.motoEditando.marca = motoSelec.data.marca;
    this.motoEditando.modelo = motoSelec.data.modelo;
    this.motoEditando.color = motoSelec.data.color;
    this.motoEditando.year = motoSelec.data.year;
    this.motoEditando.pais = motoSelec.data.pais;
    this.motoEditando.precio = motoSelec.data.precio;
    this.motoEditando.imagen = motoSelec.data.imagen;

    this.router.navigate(['/detalle', this.idMotoSelec]);

  }

  clicBotonInsertar(){
    this.router.navigate(['/detalle', 'A']);
  }

  


}
