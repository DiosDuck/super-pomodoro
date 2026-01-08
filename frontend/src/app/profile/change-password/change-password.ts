import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { passwordMatchValidator } from "../../shared/validator/password-match";

@Component({
    selector: 'app-profile-change-password',
    templateUrl: 'change-password.html',
    styleUrls: ['../../shared/styles/form-page.scss', 'change-password.scss'],
    imports: [ReactiveFormsModule],
})
export class ChangePassword {
    changePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      },
      {validators: [passwordMatchValidator]}
    );

    isWaiting = false;

    onSubmit() {

    }

    isInvalid(key: string): boolean 
  {
    switch (key) {
      case 'confirmPassword': 
        return this.isConfirmPasswordInvalid();
      default: 
        return this.isSimpleFieldInvalid(key);
    }
  }

  private isConfirmPasswordInvalid(): boolean
  {
    const controller = this.changePasswordForm.get('confirmPassword');
    if (!controller) {
      return true;
    }

    return controller.touched && (controller.invalid || this.changePasswordForm.hasError('passwordMatch'));
  }

  private isSimpleFieldInvalid(key: string): boolean
  {
    const controller = this.changePasswordForm.get(key);
    if (!controller) {
      return true;
    }

    return controller.touched && controller.invalid;
  }
}