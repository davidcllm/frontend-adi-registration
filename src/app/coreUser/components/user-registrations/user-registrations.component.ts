import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Registration } from '../../../models/registration';
import { Total } from '../../../models/total';
import { UserEventService } from '../../services/user-event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-registrations',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './user-registrations.component.html',
  styleUrl: './user-registrations.component.css'
})
export class UserRegistrationsComponent implements OnInit {
  public registrations: Registration[] = [];
  public total!: Total;

  constructor(private userEventService: UserEventService) {}

  ngOnInit() {
    this.getTotal();
    this.getRegistrations();
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);

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

  public getRegistrations(): void {
    const token = localStorage.getItem('token');

    this.userEventService.getRegistrations(token).subscribe(
      (response: Registration[]) => {
        this.registrations = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error. Su sesión ha expirado. Vuelva a iniciar sesión.');
      }
    );
  }

  public getTotal(): void {
    const token = localStorage.getItem('token');

    this.userEventService.getTotalByUser(token).subscribe(
      (response: Total) => {
        this.total = response;
      },
      (error: HttpErrorResponse) => {

      }
    );
  }
}
