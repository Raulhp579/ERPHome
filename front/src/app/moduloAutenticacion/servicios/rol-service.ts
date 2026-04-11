import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  
  private url = "/api/rol"

  constructor(private http:HttpClient){}
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getRoles():Observable<any>{
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  getRol(id: number):Observable<any>{
    return this.http.get<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  createRol(rol: any):Observable<any>{
    return this.http.post<any>(this.url, rol, { headers: this.getHeaders() });
  }

  updateRol(id: number, rol: any):Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`, rol, { headers: this.getHeaders() });
  }

  deleteRol(id: number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  getRolUsuario(id: number):Observable<any>{
    return this.http.get<any>(`${this.url}/usuario/${id}`, { headers: this.getHeaders() });
  }

  updateRolUsuario(id: number, rol: any):Observable<any>{
    return this.http.put<any>(`${this.url}/usuario/${id}`, rol, { headers: this.getHeaders() });
  }
}
