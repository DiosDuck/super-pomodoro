import { Component, inject } from "@angular/core";
import { ToastService } from "../../shared/services/toast";
import { LastRouteService } from "../../shared/services/last-route";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    templateUrl: 'forgot-password.html',
    styleUrls: ['../shared/form-page.scss', 'forgot-password.scss'],
    imports: [ReactiveFormsModule]
})
export class ForgotPassword {
    toastService = inject(ToastService);
    lastRouteService = inject(LastRouteService);

    forgotPasswordForm = new FormGroup({
        username: new FormControl('', Validators.required),
    })
    isWaiting = false;

    async onSubmit() {
        this.isWaiting = true;
        this.toastService.addToast("If the username exist, check your inbox!", "success");
        await this.lastRouteService.redirectToLastRoute();
    }

    async onBack() {
        await this.lastRouteService.redirectToLastRoute();
    }
}
