import { Component, input, output } from "@angular/core";
import { Toast } from "../../../models/toast";

@Component({
  selector: 'app-toast-line',
  templateUrl: './line.html',
  styleUrl: './line.scss',
})
export class Line {
    toast = input.required<Toast>();
    close = output<number>();

    onClose(): void
    {
        this.close.emit(this.toast().id);
    }
}
