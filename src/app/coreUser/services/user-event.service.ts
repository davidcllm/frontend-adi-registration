import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';
import { environment } from '../../../environment/environment';
import { Registration } from '../../models/registration';
import { Total } from '../../models/total';

@Injectable({
  providedIn: 'root'
})
export class UserEventService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //eventos

  getEvents(token: string | null, page: number, size: number): Observable<Event[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/event/all?page=${page - 1}&size=${size}`, { headers });
  }

  registerToEvent(eventId: number, token: string | null): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/user/event/register/${eventId}`, {}, { headers });
  }

  //pre registros

  getPreRegistrations(token: string | null): Observable<Registration[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/registration/all/espera`, { headers });
  }

  generateQr(registrationId: number, token: string | null): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/user/registration/qr/${registrationId}`, {}, { headers, responseType: 'blob' });
  }

  uploadPhoto(token: string | null, registrationId: number | undefined, file: File): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/user/registration/upload/${registrationId}`, formData, { headers });
  }

  //registros y total

  getRegistrations(token: string | null): Observable<Registration[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/total/all/aprobado`, { headers });
  }

  getTotalByUser(token: string | null): Observable<Total> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/total/my`, { headers });
  }
}