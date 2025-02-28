import { Component } from '@angular/core';
import { PanelService } from '../../services/panel.service';
import { CommonModule } from '@angular/common';
import { GiftCardService } from '../../services/gift-card.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register-giftcard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-giftcard.component.html',
  styleUrl: './register-giftcard.component.css'
})
export class RegisterGiftcardComponent {
  registerGiftCardForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  isOpen = false;

  constructor(private fb: FormBuilder, private panelService: PanelService, private giftCardService: GiftCardService, private authService: AuthServiceService){
    this.registerGiftCardForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      company: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.panelService.isOpen$.subscribe(status => {
      this.isOpen = status;
    });
  }

  createGiftCard():void{
    this.registerGiftCardForm.markAllAsTouched();

    if (this.registerGiftCardForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.giftCardService.createGiftCard(this.registerGiftCardForm.value).subscribe(
        (response) => {
          this.isLoading = false;
          this.panelService.closePanel();
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message;
        }
      );
    } else {
      Object.keys(this.registerGiftCardForm.controls).forEach((field) => {
        const control = this.registerGiftCardForm.get(field);
        if (control?.invalid) {
          this.isLoading = false;
          this.errorMessage = 'Error al crear la tarjeta de regalo';
        }
      });
    }
  }

  closePanel(){
    this.panelService.closePanel();
  }


}
