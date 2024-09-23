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
  public pageSize: number = 16;
  public currentPage: number = 1;
  public registerEvent!: Event;

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

  public getEvents(page: number): void {
    const token = localStorage.getItem('token');

    this.userEventService.getEvents(token, page, this.pageSize).subscribe(
      (response: any) => {
        this.events = response._embedded?.eventList || [];
        this.totalItems = response.page?.totalElements || 0;
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
      this.getEvents(this.currentPage);
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEvents(this.currentPage);
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
        Swal.fire('Error. El evento ya pasó, ya estás registrado al evento o ya no hay cupo.');
      },
      complete: () => {
        console.log('Registro a evento exitoso');
      }
    });
  }

  public searchEvents(key: string): void {
    const results: Event[] = [];
    for(const event of this.events) {
      if(event.id.toString().indexOf(key) !== -1) {
        results.push(event);
      }
    }

    this.events = results;
    if(results.length === 0 || !key) {
      this.getEvents(this.currentPage);
    }
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
