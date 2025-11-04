import { Component, input } from '@angular/core';
import { Status } from '../model/status';

@Component({
  selector: 'app-status-line',
  imports: [],
  templateUrl: './line.html',
  styleUrl: './line.scss'
})
export class Line {
  status = input.required<Status>();
}
