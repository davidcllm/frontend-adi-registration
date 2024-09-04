import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from '../auth/services/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authStateService: AuthStateService) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('role');
    if (userRole === 'ROLE_ADMIN') {
      return true;
    } else {
      this.authStateService.logout();
      return false;
    }
  }
}

