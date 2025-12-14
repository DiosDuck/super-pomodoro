import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user-service';
import { LastRouteService } from '../../shared/services/last-route-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  imports: [ReactiveFormsModule],
})
export class SignIn {
  userService = inject(UserService);
  lastRouteService = inject(LastRouteService);
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
        username: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? '',
      }
      await this.userService.login(loginData);
      this.router.navigateByUrl(this.lastRouteService.getLastRoute());
    } catch (err) {
      this.errorMsg.set('Username or password invalid!');
      this.isWaiting = false;
    }
  }
}
