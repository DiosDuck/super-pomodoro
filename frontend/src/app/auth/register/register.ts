import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../register.validator';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/services/toast';
import { LastRouteService } from '../../shared/services/last-route';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  imports: [ReactiveFormsModule],
})
export class Register {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  lastRouteService = inject(LastRouteService);
  router = inject(Router);

  registerForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
    },
    {validators: [passwordMatchValidator]}
  );

  errorRegister = false;
  isWaiting = false;

  async onSubmit() {
    this.isWaiting = true;
    try {
      await this.authService.register({
        username: this.registerForm.value.username!,
        password: this.registerForm.value.password!,
        displayName: this.registerForm.value.name!,
        email: this.registerForm.value.email!,
      });

      this.toastService.addToast("Successfully registered, please sign in", "success");
      this.router.navigateByUrl('/auth/sign-in');
    } catch (err) {
      this.errorRegister = true;
      this.toastService.addToast("Username is already taken", "error");
      this.isWaiting = false;
    }
  }

  async onBack() {
    await this.lastRouteService.redirectToLastRoute();
  }

  isInvalid(key: string): boolean 
  {
    switch (key) {
      case 'username':
        return this.isUsernameInvalid();
      case 'confirmPassword': 
        return this.isConfirmPasswordInvalid();
      default: 
        return this.isSimpleFieldInvalid(key);
    }
  }

  private isConfirmPasswordInvalid(): boolean
  {
    const controller = this.registerForm.get('confirmPassword');
    if (!controller) {
      return true;
    }

    return controller.touched && (controller.invalid || this.registerForm.hasError('passwordMatch'));
  }

  private isSimpleFieldInvalid(key: string): boolean
  {
    const controller = this.registerForm.get(key);
    if (!controller) {
      return true;
    }

    return controller.touched && controller.invalid;
  }

  private isUsernameInvalid(): boolean
  {
    const controller = this.registerForm.get('username');
    if (!controller) {
      return true;
    }

    return controller.touched && (controller.invalid || this.errorRegister);
  }
}
