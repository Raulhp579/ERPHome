import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl,Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth-service';
import { Router } from '@angular/router';
import { privateDecrypt } from 'crypto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  hide = true; 

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private authService: AuthService,
    private router:Router
  ){} 

  loginError:string = ''

  onSubmit(){

    this.loginError= ''
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);
          if (localStorage.getItem('token')) {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.log(error);
          this.loginError = "Credenciales no validas"
        }
      })
    }
  }
}
