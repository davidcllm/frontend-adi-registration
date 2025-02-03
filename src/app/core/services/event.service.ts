import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../models/event';
import { environment } from '../../../environment/environment';
import { Total } from '../../models/total';
import { Registration } from '../../models/registration';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  //Eventos

  getEvents(token: string | null, page: number, size: number): Observable<Event[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/admin/event/all?page=${page - 1}&size=${size}`, { headers });
  }

  addEvent(event: Event, token: string | null): Observable<Event> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Event>(`${this.apiUrl}/admin/event/add`, event, { headers });
  }

  updateEvent(event: Event, token: string | null): Observable<Event> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Event>(`${this.apiUrl}/admin/event/update`, event, { headers });
  }

  deleteEvent(eventId: number, token: string | null): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/admin/event/delete/${eventId}`, { headers });
  }

  //Tabla totales

  getTotals(token: string | null, page: number, size: number): Observable<Total[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/admin/total/all?page=${page - 1}&size=${size}`, { headers });
  }

  //Escaneo

  scanQr(registrationId: number, token: string | null): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<string>(`${this.apiUrl}/admin/scan/update/${registrationId}`, {}, { headers });
  }

  //Tabla registros

  getRegistrations(token: string | null, page: number, size: number, searchKey: string = ''): Observable<Registration[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/admin/registration/all?page=${page - 1}&size=${size}`, { headers });
  }

  patchApprovalStatus(registrationId: number, status: string | null, token: string | null): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = JSON.stringify(status);

    return this.http.patch<string>(`${this.apiUrl}/admin/registration/approve/${registrationId}`, body, { headers });
  }

  deleteRegistration(registrationId: number, token: string | null): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<string>(`${this.apiUrl}/admin/registration/delete/${registrationId}`, { headers });
  }

  getPhoto(registrationId: number | undefined, token: string | null): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string>(`${this.apiUrl}/admin/registration/photo/${registrationId}`, { headers });
  }
}
