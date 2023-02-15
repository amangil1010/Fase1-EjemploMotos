import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) { }

  public  uploadImage(nombreCarpeta, nombreArchivo, imagenBase64){
    
    let storageRef =
    this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);

    return storageRef.putString("data:image/jpeg;base64, " + imagenBase64, 'data_url');

  }

  public deleteFileFromUrl (fileURL){
    return this.angularFireStorage.storage.refFromURL(fileURL).delete();
  }

  public insertar(motos, datos){
    return this.angularFirestore.collection(motos).add(datos);
     
  }

  public consultar(motos) {
    return this.angularFirestore.collection(motos).snapshotChanges();
  }

  public borrar(motos, documentId){
    return this.angularFirestore.collection(motos).doc(documentId).delete();
  }

  public actualizar(motos, documentId, datos) {
    return this.angularFirestore.collection(motos).doc(documentId).set(datos);
   }

   public consultarPorId(motos, documentId) {
    return this.angularFirestore.collection(motos).doc(documentId).snapshotChanges();
  }

}
