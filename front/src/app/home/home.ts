import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
