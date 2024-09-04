import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { User } from '../../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStateService } from '../../services/auth-state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    FormsModule, 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {  
  constructor(private authService: AuthService, private authStateService: AuthStateService, private route: Router) {}  

  public onLogin(loginForm: NgForm): void {
    document.getElementById('register-user-form')?.click();

    this.authService.login(loginForm.value).subscribe({
      next: (response: User) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        //this.getSecureMessage(response.token);
        this.authStateService.setLoginState(true);
        this.route.navigate(['/perfil']);

        //console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('No se pudo iniciar sesión. Asegúrate de que tu contraseña y correo sean correctos.');
      },
      complete: () => {
        //console.log('Login request completed');
      }
    });
  }

  public onRegister(registerForm: NgForm): void {
    document.getElementById('register-user-form')?.click();

    this.authService.register(registerForm.value).subscribe({
      next: (response: User) => {
        //console.log(response);
        registerForm.reset();
        Swal.fire('Usuario creado exitosamente.');
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('No se pudo crear la cuenta, el correo y id ingresados puede que ya estén ocupados o asegúrate de que el correo sea de la Red de Universidades Anáhuac.');
      },
      complete: () => {
        //console.log('Registration request completed');
      }
    });
  }
  
  /*public getSecureMessage(token: string): void {
    this.authService.getSecureMessage(token).subscribe({
      next: (response: string) => {
        //console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        alert('Error de tipo: ' + error.status);
      },
      complete: () => {
        //console.log('Secure Message');
      }
    })
  }*/

  public onOpenModal(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'register') {
      button.setAttribute('data-target', '#registerModal')
    }

    container?.appendChild(button);
    button.click();
  }
}
