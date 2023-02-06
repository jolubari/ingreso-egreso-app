import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubscription: Subscription;

  constructor( private authService: AuthService, private router: Router, private store: Store<AppState>) {

  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .pipe( filter( ({user}) =>  user !== null) )
    .subscribe( ({user}) => this.nombre = user.nombre);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout().then( () => this.router.navigate( ['/login'] ) );
  }

}
