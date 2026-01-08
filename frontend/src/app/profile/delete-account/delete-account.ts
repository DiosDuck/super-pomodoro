import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: 'app-profile-delete-account',
    templateUrl: 'delete-account.html',
    styleUrls: ['../../shared/styles/form-page.scss', 'delete-account.scss'],
    imports: [ReactiveFormsModule],
})
export class DeleteAccount {
    deleteAccountForm = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    });

    isWaiting = false;

    onSubmit() {

    }

    isInvalid(key: string): boolean
    {
        const controller = this.deleteAccountForm.get(key);
        if (!controller) {
        return true;
        }

        return controller.touched && controller.invalid;
    }
}