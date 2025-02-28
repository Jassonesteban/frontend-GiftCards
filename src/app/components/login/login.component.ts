import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { Login } from '../../interfaces/Login';
import { AuthServiceService } from '../../services/auth-service.service';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  credentials: Login = { email: '', password: '', token: '' };
  isLoading = false;
  errorMessage: string | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private authModalService: AuthModalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    const {email, password} = this.loginForm.value;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authModalService.closeModal();
      this.authService.loginUser(email ?? "", password??"").add( () => {
        this.isLoading = false;
        window.location.reload();
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        if (control?.invalid) {
          this.errorMessage = "Credenciales incorrectas";
        }
      });
    }
  }
}
