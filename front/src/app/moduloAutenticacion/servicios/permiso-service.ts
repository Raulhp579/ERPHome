import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  
  private url = "/api/permiso"

  constructor(private http:HttpClient){}
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getPermisos():Observable<any>{
    return this.http.get<any>(this.url, { headers: this.getHeaders() });
  }

  getPermiso(id: number):Observable<any>{
    return this.http.get<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  createPermiso(permiso: any):Observable<any>{
    return this.http.post<any>(this.url, permiso, { headers: this.getHeaders() });
  }

  updatePermiso(id: number, permiso: any):Observable<any>{
    return this.http.put<any>(`${this.url}/${id}`, permiso, { headers: this.getHeaders() });
  }

  deletePermiso(id: number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  getPermisosPorModulo(id:number):Observable<any>{
    return this.http.get<any>(`${this.url}/modulo/${id}`, { headers: this.getHeaders() });
  }

  getPermisosDeUnUsuario(id:number):Observable<any>{
    return this.http.get<any>(`${this.url}/usuario/${id}`, { headers: this.getHeaders() });
  }

  asignarPermisoUsuario(id:number, idUser:number):Observable<any>{
    return this.http.post<any>(`${this.url}/asignar/${idUser}`, { id }, { headers: this.getHeaders() });
  }

  quitarPermisoUsuario(id:number, idUser:number):Observable<any>{
    return this.http.post<any>(`${this.url}/quitar/${idUser}`, { id }, { headers: this.getHeaders() });
  }
}
