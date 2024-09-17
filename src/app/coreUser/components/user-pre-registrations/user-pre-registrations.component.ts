import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Registration } from '../../../models/registration';
import { UserEventService } from '../../services/user-event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-pre-registrations',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './user-pre-registrations.component.html',
  styleUrl: './user-pre-registrations.component.css'
})
export class UserPreRegistrationsComponent implements OnInit {
  public preRegistrations: Registration[] = [];
  public qrRegistration!: Registration;
  public qrImageUrl: string | null = null;

  @ViewChild('fileInput', { static: false}) fileInput!: ElementRef;

  constructor(private userEventService: UserEventService) {}

  ngOnInit() {
    this.getPreRegistrations();
  }

  formatDate(date: any): string {
    if (!date || !Array.isArray(date)) return 'Fecha no válida';
  
    const d = new Date(date[0], date[1] - 1, date[2]);
  
    if (isNaN(d.getTime())) {
      return 'Fecha no válida';
    }
  
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
  
    return `${day}-${month}-${year}`;
  }

  formatTime(time: any): string {
    if (!time || !Array.isArray(time)) return '';
  
    const hours = String(time[0]).padStart(2, '0');
    const minutes = String(time[1]).padStart(2, '0');
    const seconds = '00'; 
  
    return `${hours}:${minutes}`;
  }
  
  public getPreRegistrations(): void {
    const token = localStorage.getItem('token');

    this.userEventService.getPreRegistrations(token).subscribe(
      (response: Registration[]) => {
        this.preRegistrations = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error. Su sesión ha expirado. Vuelva a iniciar sesión.');
      }
    );
  }

  public generateQr(id: number): void {
    const token = localStorage.getItem('token');

    this.userEventService.generateQr(id, token).subscribe({
      next: (response: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.qrImageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error inesperado: ' + error.status + ".");
      },
      complete: () => {
        console.log('Qr mostrado exitosamente');
      }
    });
  }

  public onPhotoUploadClick(registration: any): void {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event, preRegistrationId: number | undefined): void {
    const inputFile = (event.target as HTMLInputElement);
    const file = inputFile.files?.[0];

    if(file) {
      this.uploadPhoto(file, preRegistrationId);
    }
  }

  uploadPhoto(file: File, registrationId: number | undefined): void {
    const token = localStorage.getItem('token');

    this.userEventService.uploadPhoto(token, registrationId, file).subscribe({
      next: (response: void) => {
        
      },
      error: (error: HttpErrorResponse) => {
        if(error.status !== 200) {
          Swal.fire('Error al subir la foto. El archivo excede los 350kb, el código qr aún no ha sido escaneado o ya hay una foto en este registro.');
        }
        else {
          Swal.fire('Foto subida exitosamente.')
        }
      },
      complete: () => {
        console.log('Foto subida exitosamente');
      }
    });
  }

  public onOpenModal(registration: Registration, mode: string): void { 
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'generate') {
      if(registration !== null) {
        this.qrRegistration = registration;
        this.generateQr(registration.id);
        button.setAttribute('data-target', '#qrModal');
      }
    }

    container?.appendChild(button);
    button.click();
  }
}
