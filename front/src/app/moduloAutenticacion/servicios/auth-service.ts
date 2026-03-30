import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = "/api/login"

  constructor(private http:HttpClient){}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  login(credenciales: any):Observable<any>{
    return this.http.post<any>(this.url, credenciales);
  }

  logout():Observable<any>{
    return this.http.post<any>(`${this.url}/logout`, {}, { headers: this.getHeaders() });
  }
}
