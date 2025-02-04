import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Total } from '../../../models/total';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-total',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './admin-total.component.html',
  styleUrl: './admin-total.component.css'
})
export class AdminTotalComponent implements OnInit {
  public totals: Total[] = [];
  public totalItems: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 16;
  public currentPage: number = 1;
  public searchKey: string = "";

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.getTotals(this.currentPage);
  }

  public getTotals(page: number, searchKey: string = ''): void {
    const token = localStorage.getItem('token');

    this.eventService.getTotals(token, page, this.pageSize, searchKey).subscribe(
      (response: any) => {
        this.totals = response._embedded.totalList || [];
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
      this.getTotals(this.currentPage, this.searchKey);
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getTotals(this.currentPage, this.searchKey);
    }
  }

  public searchTotals(key: string): void {
    this.searchKey = key;
    this.getTotals(1, key);
  }

}
