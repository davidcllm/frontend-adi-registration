import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn = this.loggedIn.asObservable();

  constructor(private router: Router) {}

  setLoginState(state: boolean) {
    this.loggedIn.next(state);
  }

  logout() {
    this.setLoginState(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}