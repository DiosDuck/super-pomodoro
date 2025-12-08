import { Component, inject, computed } from '@angular/core';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  dialogService = inject(DialogService);
  isOpen = computed(() => this.dialogService.isOpen());

  onClose() {
    this.dialogService.close();
  }
}
