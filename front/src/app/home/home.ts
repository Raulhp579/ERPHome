import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FullCalendarModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'title',
      right: 'prev,next'
    },
    events: [
      { title: 'Reunión Equipo', date: new Date().toISOString().split('T')[0] },
      { title: 'Entrega Proyecto', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] }
    ]
  };

  showReminderModal = true;
}
