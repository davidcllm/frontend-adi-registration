import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../models/user";
import { environment } from "../../../environment/environment";
import { LoginRequest } from "../../models/login.request";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiServerUrl = environment.apiBaseUrl;  

    constructor(private http: HttpClient) {}

    public login(loginRequest: LoginRequest): Observable<User> {
        return this.http.post<User>(`${this.apiServerUrl}/auth/login`, loginRequest);
    }
    public register(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiServerUrl}/auth/register`, user);
    }
    public getSecureMessage(token: string): Observable<string> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<string>(`${this.apiServerUrl}/api/v1/demo`, {}, { headers, responseType: 'text' as 'json'});
    }
}