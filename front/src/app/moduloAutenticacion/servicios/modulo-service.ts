import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ModuloService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return headers;
  }

  getModulos() {
    return this.http.get('http://localhost:8000/api/modulo', { headers: this.getHeaders() }); //falta terminar asignar usuario
  }
  
}
