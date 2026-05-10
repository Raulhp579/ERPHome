import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movimiento } from '../modelos/movimiento';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private apiUrl = 'api/movimiento';
  constructor(private http: HttpClient) {}
  
  public getHeaders(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }
  
  public getAll(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }
  
  public getById(id: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id, { headers: this.getHeaders() });
  }
  
  public create(movimiento: Movimiento): Observable<any> {
    return this.http.post(this.apiUrl, movimiento, { headers: this.getHeaders() });
  }
  
  public update(id: number, movimiento: Movimiento): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, movimiento, { headers: this.getHeaders() });
  }
  
  public delete(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id, { headers: this.getHeaders() });
  }

  public getTotalIngresos(fecha_inicio:Date | null = null ,fecha_fin:Date | null = null): Observable<any> {
    return this.http.get(this.apiUrl + '/ingresos', { headers: this.getHeaders() });
  }
  
  public getTotalGastos(fecha_inicio:Date | null = null ,fecha_fin:Date | null = null): Observable<any> {
    return this.http.get(this.apiUrl + '/gastos', { headers: this.getHeaders() });
  }
  
  public getTotalBalance(fecha_inicio:Date | null = null ,fecha_fin:Date | null = null): Observable<any> {
    return this.http.get(this.apiUrl + '/balance', { headers: this.getHeaders() });
  }

}
