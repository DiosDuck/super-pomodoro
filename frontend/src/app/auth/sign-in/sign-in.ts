import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  imports: [ReactiveFormsModule],
})
export class SignIn {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  toastService = inject(ToastService);
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  isWaiting = false;

  async onSubmit() {
    this.isWaiting = true;
    try {
      const loginData = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      }
      await this.authService.login(loginData);
      this.toastService.addToast("Successful sign in!", "success");
      this.router.navigateByUrl(this.localStorageService.getLastRoute());
    } catch (err) {
      this.toastService.addToast("Username or password invalid!", "error");
      this.isWaiting = false;
    }
  }

  onBack() {
    this.router.navigateByUrl(this.localStorageService.getLastRoute());
  }
}
