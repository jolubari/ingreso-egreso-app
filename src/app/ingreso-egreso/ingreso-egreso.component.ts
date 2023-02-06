import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar() {
    this.store.dispatch( ui.isLoading() );

    if (this.ingresoEgresoForm.invalid) {
      return;
    }

    const {descripcion, monto} = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo, null );
    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () =>  {
        this.ingresoEgresoForm.reset();
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Registro creado!', descripcion, 'success');
      })
    .catch( err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire('Error', err.message, 'error')
    })
  }
}
