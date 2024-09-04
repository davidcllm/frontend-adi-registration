import { Component } from '@angular/core';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  constructor(private authStateService: AuthStateService) {}

  logout() {
    this.authStateService.logout();
  }
}
