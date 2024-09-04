import { Component } from '@angular/core';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  constructor(private authStateService: AuthStateService) {}

  logout() {
    this.authStateService.logout();
  }
}
