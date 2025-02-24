import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { AuthModalService } from '../../services/auth-modal.service';
import { user } from '../../interfaces/User';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userInfo: Object = {};
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private authModalService: AuthModalService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    const formattedData: user = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      cardIds: this.registerForm.value.cardsId,
    };

    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.registerUser(formattedData).subscribe({
        next: () => {
          this.authModalService.closeModal();
          this.authService.loginUser(
            formattedData.email,
            formattedData.password
          );
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al registrarse';
        },
      });
      this.authModalService.closeModal();
    } else {
      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.get(field);
        if (control?.invalid) {
          this.isLoading = false;
          this.errorMessage = 'Error al registrarse';
        }
      });
    }
  }
}
