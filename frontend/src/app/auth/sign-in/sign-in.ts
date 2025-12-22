import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage-service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  imports: [ReactiveFormsModule],
})
export class SignIn {
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  errorMsg = signal<string>('');
  isWaiting = false;

  async onSubmit() {
    this.isWaiting = true;
    try {
      const loginData = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!,
      }
      await this.authService.login(loginData);
      this.router.navigateByUrl(this.localStorageService.getLastRoute());
    } catch (err) {
      this.errorMsg.set('Username or password invalid!');
      this.isWaiting = false;
    }
  }

  onBack() {
    this.router.navigateByUrl(this.localStorageService.getLastRoute());
  }
}
