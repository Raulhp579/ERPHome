import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = "/api/login"
  private logoutUrl = "/api/logout"

  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http:HttpClient){}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  login(credenciales: any):Observable<any>{
    return this.http.post<any>(this.url, credenciales).pipe(
      tap((res) => {
        if (res?.access_token) {
          localStorage.setItem('token', res.access_token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout():Observable<any>{
    return this.http.post<any>(this.logoutUrl, {}, { headers: this.getHeaders() }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isLoggedIn.set(false);
      })
    );
  }
}
