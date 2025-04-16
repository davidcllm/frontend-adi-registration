import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Event } from '../../../models/event';
import { UserEventService } from '../../services/user-event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-calendar',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './user-calendar.component.html',
  styleUrl: './user-calendar.component.css'
})
export class UserCalendarComponent implements OnInit {
  public events: Event[] = [];
  public totalItems: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 16;
  public currentPage: number = 1;
  public registerEvent!: Event;
  public searchKey: string = "";

  constructor(private userEventService: UserEventService) {}

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

    this.userEventService.getEvents(token, page, this.pageSize, searchKey).subscribe(
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

  public registerToEvent(eventId: number): void {
    const token = localStorage.getItem('token');

    this.userEventService.registerToEvent(eventId, token).subscribe({
      next: (response: void) => {
        this.getEvents(this.currentPage);
        Swal.fire('Te has inscrito al evento exitosamente.');
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error. El evento está a 40 minutos de empezar, ya estás registrado al evento o ya no hay cupo.');
      },
      complete: () => {
        console.log('Registro a evento exitoso');
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

    if(mode === 'register') {
      if(event !== null) {
        this.registerEvent = event;
        button.setAttribute('data-target', '#registerEventModal');
      }
    }

    container?.appendChild(button);
    button.click();
  }
}
