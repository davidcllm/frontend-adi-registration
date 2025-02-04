import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Registration } from '../../../models/registration';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-registrations',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './admin-registrations.component.html',
  styleUrl: './admin-registrations.component.css'
})
export class AdminRegistrationsComponent implements OnInit {
  public registrations: Registration[] = [];
  public totalItems: number = 0;
  public totalPages: number = 0
  public pageSize: number = 16;
  public currentPage: number = 1;
  public editRegistration!: Registration;
  public deleteRegistration!: Registration;
  public imageUrl: string = "";
  public searchKey: string = "";

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.getRegistrations(this.currentPage);
  }

  public getRegistrations(page: number, searchKey: string = ''): void {
    const token = localStorage.getItem('token');

    this.eventService.getRegistrations(token, page, this.pageSize, searchKey).subscribe(
      (response: any) => {
        this.registrations = response._embedded?.registrationList || [];
        this.totalItems = response.page?.totalElements || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = page;

        /*if(this.searchKey) {
          this.searchTotals(this.searchKey)
        }*/
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error. Su sesión ha expirado. Vuelva a iniciar sesión.');
      }
    );
  }

  public nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalItems) {
      this.currentPage++;
      this.getRegistrations(this.currentPage, this.searchKey);
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getRegistrations(this.currentPage, this.searchKey);
    }
  }

  public patchApprovalStatus(registrationId: number, status: string): void {
    const token = localStorage.getItem('token');

    this.eventService.patchApprovalStatus(registrationId, status, token).subscribe({
      next: (response: string) => {
        this.getRegistrations(this.currentPage, this.searchKey);
      },
      error: (error: HttpErrorResponse) => {
        if(error.status !== 200) {
          Swal.fire('Error. El registro ya no se encuentra en estado de ESPERA o el código qr aún no ha sido escaneado.');
        }
        if(error.status === 200) {
          this.getRegistrations(this.currentPage, this.searchKey);
          Swal.fire('Estatus de aprobación modificado exitosamente.')
        }
      },
      complete: () => {
        console.log('Registro actualizado exitosamente');
      }
    });
  }

  public onDeleteRegistration(registrationId: number): void {
    const token = localStorage.getItem('token');

    this.eventService.deleteRegistration(registrationId, token).subscribe({
      next: (response: string) => {
        this.getRegistrations(this.currentPage);
      },
      error: (error: HttpErrorResponse) => {
        if(error.status !== 200) {
          Swal.fire('Error. El registro no se puede eliminar porque ya no se encuentra en estado de ESPERA o el qr ya fue escaneado.');
        }
        if(error.status === 200) {
          this.getRegistrations(this.currentPage);
          Swal.fire('Registro eliminado exitosamente.');
        }
      },
      complete: () => {
        console.log('Registro eliminado exitosamente');
      }
    });
  }

  public searchTotals(key: string): void { 
    this.searchKey = key;
    this.getRegistrations(1, key);
  }

  public searchPhoto(id: number) {
    const token = localStorage.getItem('token');

    this.eventService.getPhoto(id, token).subscribe({
      next: (response: string) => {
        this.imageUrl = response;
      },
      error: (error: HttpErrorResponse) => {
        if(error.status === 200) {
          this.imageUrl = error.error.text; 
        } 
        else {
          Swal.fire('No hay ninguna foto en este registro.')
          this.imageUrl = "";
        }
      },
      complete: () => {
        console.log('Solicitud completa');
      }
    });
  }

  public onOpenModal(registration: Registration, mode: string): void { 
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'edit') {
      if(registration !== null) {
        this.editRegistration = registration;
        button.setAttribute('data-target', '#updateRegistrationModal');
      }
    }
    if(mode === 'delete') {
      if(registration !== null) {
        this.deleteRegistration = registration;
        button.setAttribute('data-target', '#deleteRegistrationModal');
      }
    }
    if(mode === 'photo') {
      this.searchPhoto(registration.id);
      button.setAttribute('data-target', '#searchPhotoModal');
    }

    container?.appendChild(button);
    button.click();
  } 
}
