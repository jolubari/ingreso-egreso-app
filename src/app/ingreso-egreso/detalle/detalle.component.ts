import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubscription: Subscription

  constructor( private store: Store<AppStateWithIngreso>, private ingresoEgresoService: IngresoEgresoService ) {

  }


  ngOnInit(): void {
    this.ingresosEgresosSubscription = this.store.select('ingresosEgresos').subscribe( ({items}) => { // objeto.items
      this.ingresosEgresos = items;
    })
  }


  ngOnDestroy(): void {
    this.ingresosEgresosSubscription.unsubscribe();
  }

  borrar(uid: string) {
    this.ingresoEgresoService.borrarINgresoEgreso(uid)
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success') )
      .catch( (err) => Swal.fire('Error', err.message, 'error') )
  }

}
