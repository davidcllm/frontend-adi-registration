import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Event } from '../../../models/event';
import { EventService } from '../../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-calendar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.css'
})
export class AdminCalendarComponent implements OnInit {
  public events: Event[] = [];
  public totalItems: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 16;
  public currentPage: number = 1;
  public editEvent!: Event;
  public deleteEvent!: Event;
  public searchKey: string = "";

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.getEvents(this.currentPage);
  }

  formatDate(date: any): string {
    if (!date) return '';
    
    const d = new Date(date + 'T00:00:00Z'); 

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  formatTime(time: string | undefined): string {
    if (!time) return '';
  
    if (time.length === 8) {
      return time.slice(0, -3);
    }
  
    return time; 
  }

  public getEvents(page: number, searchKey: string = ''): void {
    const token = localStorage.getItem('token');

    this.eventService.getEvents(token, page, this.pageSize, searchKey).subscribe(
      (response: any) => {
        this.events = response._embedded?.eventList || [];
        this.totalItems = response.page?.totalElements || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = page;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error. Su sesión ha expirado. Vuelva a iniciar sesión.');
      }
    );
  }

  public nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalItems) {
      this.currentPage++;
      this.getEvents(this.currentPage, this.searchKey);
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEvents(this.currentPage, this.searchKey);
    }
  }

  public onAddEvent(addForm: NgForm): void {
    document.getElementById('add-event-form')?.click();
    const token = localStorage.getItem('token');

    this.eventService.addEvent(addForm.value, token).subscribe({
      next: (response: Event) => {
        this.getEvents(this.currentPage);
        addForm.reset();
        Swal.fire('Evento agregado exitosamente.');
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error. No puedes agregar un evento con una fecha pasada.');
      },
      complete: () => {
        console.log('Evento agregado exitosamente');
      }
    });
  }

  public onUpdateEvent(event: Event): void {
    const token = localStorage.getItem('token');

    this.eventService.updateEvent(event, token).subscribe({
      next: (response: Event) => {
        this.getEvents(this.currentPage);
        Swal.fire('Evento editado exitosamente.');
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error. No puedes editar un evento con una fecha pasada.');
      },
      complete: () => {
        console.log('Evento editado exitosamente');
      }
    });
  }

  public onDeleteEvent(eventId: number): void {
    const token = localStorage.getItem('token');

    this.eventService.deleteEvent(eventId, token).subscribe({
      next: (response: void) => {
        this.getEvents(this.currentPage);
        Swal.fire('Evento eliminado exitosamente.');
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error. No se puede eliminar el evento, ya que hay registros asociados a este.');
      },
      complete: () => {
        console.log('Evento eliminado exitosamente');
      }
    });
  }

  public searchEvents(key: string): void {
    this.searchKey = key;
    this.getEvents(1, key);
  }

  public onOpenModal(event: Event | null, mode: string): void { 
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'add') {
      button.setAttribute('data-target', '#addEventModal');
    }
    if(mode === 'edit') {
      if(event !== null) {
        this.editEvent = event;
        button.setAttribute('data-target', '#updateEventModal');
      }
    }
    if(mode === 'delete') {
      if(event !== null) {
        this.deleteEvent = event;
        button.setAttribute('data-target', '#deleteEventModal');
      }
    }

    container?.appendChild(button);
    button.click();
  } 
}
