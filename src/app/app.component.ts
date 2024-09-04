import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthStateService } from './auth/services/auth-state.service';
import { AdminNavbarComponent } from './shared/components/admin-navbar/admin-navbar.component';
import { UserNavbarComponent } from './shared/components/user-navbar/user-navbar.component';
import { AdminCalendarComponent } from './core/components/admin-calendar/admin-calendar.component';
import { AdminRegistrationsComponent } from './core/components/admin-registrations/admin-registrations.component';
import { AdminTotalComponent } from './core/components/admin-total/admin-total.component';
import { QrScannerComponent } from './core/components/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    LoginComponent,
    /*AdminCalendarComponent,
    AdminRegistrationsComponent,
    AdminTotalComponent,
    QrScannerComponent,*/
    AdminNavbarComponent,
    UserNavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  title = 'spring-jwt-front';
  public isLoggedIn: boolean = false;
  public userRole: string | null = null;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    this.authStateService.isLoggedIn.subscribe(state => {
      this.isLoggedIn = state;
      if(this.isLoggedIn) {
        this.userRole = localStorage.getItem('role');
      }
    });
  }

  /*onSignOut() {
    this.authStateService.setLoginState(false);
    localStorage.removeItem('token');
    localStorage.removeItem('item');
  }*/
}
