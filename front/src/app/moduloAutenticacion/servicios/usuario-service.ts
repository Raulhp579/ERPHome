import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class UsuarioService {

  private url = '/api/user'

  constructor(private http:HttpClient){}
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getUsuarios():Observable<any>{
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  getUsuario(id: number):Observable<any>{
    return this.http.get<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  createUsuario(usuario: any):Observable<any>{
    return this.http.post<any>(this.url, usuario, { headers: this.getHeaders() });
  }

  updateUsuario(id: number, usuario: any):Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`, usuario, { headers: this.getHeaders() });
  }

  deleteUsuario(id: number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  me():Observable<any>{
    return this.http.get<any>(`api/me`, { headers: this.getHeaders() });
  }

  cambiarContrasenya(usuario: any):Observable<any>{
    return this.http.put<any>(`api/cambiar-contrasena`, usuario, { headers: this.getHeaders() });
  }

}


