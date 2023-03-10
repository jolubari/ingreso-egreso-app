import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore: AngularFirestore, private authService: AuthService) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const uid = this.authService.user.uid as string;

    return this.firestore.collection(`${uid}/ingresos-egresos/items`).add({...ingresoEgreso});
  }

  initIngresosEgresosListener(uid: string) {
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        // map( snapshot => {
        //   return snapshot.map( doc =>  {
        //     return {
        //       uid: doc.payload.doc.id,
        //       ...doc.payload.doc.data() as any
        //     }
        //   })
        // })
        map( snapshot => snapshot.map( doc => ({
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            })
          )
        )
      );
  }

  borrarINgresoEgreso( uidItem: string ) {
    const uid = this.authService.user.uid as string;
    return this.firestore.doc( `${uid}/ingresos-egresos/items/${uidItem}` ).delete();
  }
}
