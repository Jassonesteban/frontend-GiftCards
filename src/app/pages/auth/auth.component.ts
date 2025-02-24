import { Component } from '@angular/core';
import { LoginComponent } from "../../components/login/login.component";
import { RegisterComponent } from "../../components/register/register.component";
import { CommonModule } from '@angular/common';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule,LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isOpen = false;
  isLogin = true;

  constructor(private authModalService: AuthModalService){}

  ngOnInit(): void {
    this.authModalService.modalState.subscribe((state) => {
      this.isOpen = state.isOpen;
      this.isLogin = state.isLogin;
    });
  }

  closeModal() {
    this.authModalService.closeModal();
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;
  }

}
