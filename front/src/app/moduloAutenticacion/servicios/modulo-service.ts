import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModuloService {
  constructor(private http: HttpClient) {}

  private url:string = "api/modulo"

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return headers;
  }

  getModulos() {
    return this.http.get(this.url, { headers: this.getHeaders() }); 
  }
  
}
