import { Component } from '@angular/core';
import { Moto } from '../moto';

import { FirestoreService } from '../firestore.service';

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

  constructor(private firestoreService: FirestoreService) {
    //crear una tarea vacia
    this.motoEditando={} as Moto;
    this.obtenerListaMoto();
  }

  clicBotonInsertar(){
    this.firestoreService.insertar("motos", this.motoEditando).then(() => {
      console.log("Moto creada correctamente");
      this.motoEditando = {} as Moto;
    }, (error) => {
      console.error(error);
    });
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


}
