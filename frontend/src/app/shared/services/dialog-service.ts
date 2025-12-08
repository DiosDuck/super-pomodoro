import { computed, signal, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
    isOpen = signal<boolean>(false);

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
    }
}
