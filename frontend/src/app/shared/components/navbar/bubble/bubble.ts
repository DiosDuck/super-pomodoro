import { Component, computed, input, output } from '@angular/core';
import { navId } from '../../navbar.config';

@Component({
  selector: 'app-nav-bubble',
  imports: [],
  templateUrl: './bubble.html',
  styleUrl: './bubble.scss',
})
export class Bubble {
  id = input.required<navId>();
  currentId = input.required<navId>();
  icon = input.required<string>();

  isSelected = computed<boolean>(() => this.currentId() === this.id());
  currentIcon = computed<string>(() => this.isSelected() ? 'close' : this.icon())

  onSelect = output<navId>();

  toggle() {
    let val : navId = this.isSelected() ? null : this.id();
    this.onSelect.emit(val);
  }
}
