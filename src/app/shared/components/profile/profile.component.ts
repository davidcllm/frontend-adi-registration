import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  public profile!: User;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getProfile();
  }

  public getProfile(): void {
    const token = localStorage.getItem('token');

    this.profileService.getProfile(token).subscribe(
      (response: User) => {
        this.profile = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Su sesión ha expirado. Vuelva a iniciar sesión.');
      }
    );
  }
}
