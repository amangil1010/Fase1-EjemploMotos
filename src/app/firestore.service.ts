import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(motos, datos){
    return this.angularFirestore.collection(motos).add(datos);
     
  }

  public consultar(motos) {
    return this.angularFirestore.collection(motos).snapshotChanges();
  }
}
