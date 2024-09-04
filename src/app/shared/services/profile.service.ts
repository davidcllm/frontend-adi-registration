import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getProfile(token: string | null): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/profile`, { headers });
  }

}