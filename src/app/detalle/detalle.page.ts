import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Moto } from '../moto';

import { FirestoreService } from '../firestore.service';

import {Router} from '@angular/router';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { resourceLimits } from 'worker_threads';

import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  motoEditando: Moto;

  idMotoSelec: string;

  document: any = {
    id: "",
    data: {} as Moto
  };

  id: string = "";
  
  handlerMessage = '';
  roleMessage = '';

  constructor(private socialSharing: SocialSharing,private firestoreService: FirestoreService, 
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private alertController: AlertController, private activatedRoute: ActivatedRoute, private router: Router) {   

  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.firestoreService.consultarPorId("motos", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        // console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Moto;
      } 
    });
  }

  clicBotonInsertar(){
    this.firestoreService.insertar("motos", this.document.data).then(() => {
      console.log("Moto creada correctamente");
      this.motoEditando = {} as Moto;
    }, (error) => {
      console.error(error);
    });
    this.router.navigate(['/home']);

  }

  // clicBotonBorrar() {
  //   this.firestoreService.borrar("motos", this.id).then(() => {
  //     // this.obtenerListaMoto();
  //     this.document.data = {} as Moto;
  //   })
  //   this.router.navigate(['/home']);

  // }

  clicBotonModificar() {
    this.firestoreService.actualizar("motos", this.document.id, this.document.data).then(() => {
      // Actualizar la lista completa
      // this.obtenerListaMoto();
      
      // Limpiar datos de pantalla
      this.document.data = {} as Moto;
      this.router.navigate(['/home']);
    })
  }

  clicBotonCancelar(){
    this.router.navigate(['/home']);
  }



  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Cuidado!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          handler: () => {
            this.handlerMessage = 'Cancelar';
          },
        },
        {
          text: 'OK',
          role: 'confirmar',
          handler: () => {
            ///////////////////
            this.deleteFile(this.document.data.imagen);
            ///////////////////
            this.handlerMessage = 'Alert confirmed';
            this.firestoreService.borrar("motos", this.id).then(() => {
              this.document.data = {} as Moto;
            })
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;

      
    }

async uploadImagePicker(){

  const loading = await this.loadingController.create({
    message: 'Please wait...'
  });

  const toast = await this.toastController.create({
    message: 'Image was updated successfully',
    duration: 3000
  });

  this.imagePicker.hasReadPermission().then(
    (result) => {
      if(result == false){
        this.imagePicker.requestReadPermission();
      } 
      else {
        this.imagePicker.getPictures({
          maximumImagesCount: 1,
          outputType: 1
        }).then(
          (results) => {
            let nombreCarpeta = "imagenes";

            for (var i = 0; i < results.length; i++) {
              loading.present();
              let nombreImagen = `${new Date().getTime()}`;
              this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])

              .then(snapshot => {
                snapshot.ref.getDownloadURL()
                  .then(downloadURL => {

                    console.log("downloadURL:" + downloadURL);

                    this.document.data.imagen = downloadURL;

                    toast.present();

                    loading.dismiss();
                  })
              })
            }
          },
          (err) => {
            console.log(err)
          }
        );
      }
    }
  ), (err) => {
    console.log(err);
  }};


  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });

    this.firestoreService.deleteFileFromUrl(fileURL)

      .then(() => {

      toast.present();

     }, (err) => {

        console.log(err);
    });
  }

    regularSharing() {
      this.socialSharing.share(`Compartir: ${this.document.data.marca}-${this.document.data.marca} `).then(() => {
        console.log("Se ha compartido correctamente");
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }



}
