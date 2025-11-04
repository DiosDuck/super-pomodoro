import { Component, effect, input, signal } from '@angular/core';
import { StatusRequest } from '../models/status';
import { StatusService } from '../services/status-service';

@Component({
  selector: 'app-status-line',
  imports: [],
  templateUrl: './line.html',
  styleUrl: './line.scss',
})
export class Line {
  status = input.required<StatusRequest>();

  response = signal<'waiting'|'success'|'error'>('waiting');

  constructor(private statusService: StatusService) {
    effect(() => {
      const url = this.status().url;
      if (!url) {
        return;
      }

      this.statusService.getResponse(url).subscribe({
        next: (res) => {this.response.set('success')},
        error: (err) => {this.response.set('error')},
      });
    });
  }
}
