import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return { ...this._user };
  }

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fUser => {
      if (fUser) {
        this.userSubscription = this.firestore.doc(`${fUser.uid}/usuario`).valueChanges()
          .subscribe( firestoreUser =>  {
            const user = Usuario.fromFirestore( firestoreUser );
            this.store.dispatch( authActions.setUser( { user: user } ) );
          })
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }
    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {
    return this.auth.createUserWithEmailAndPassword( email, password )
      .then( ({ user }) => {
        const newUser = new Usuario( user.uid, nombre, user.email );
        return this.firestore.doc(`${user.uid}/usuario`).set( {...newUser} )
      });
  }

  loginUsuario( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe( map( fUser => fUser !== null ) );
  }
}
