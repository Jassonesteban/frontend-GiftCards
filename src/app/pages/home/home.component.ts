import { Component } from '@angular/core';
import { ListgiftCardComponent } from "../../components/listgift-card/listgift-card.component";
import { GiftCardService } from '../../services/gift-card.service';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [ListgiftCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  showBtn = false;
  loading = false;
  success: boolean | null = null;

  constructor(private giftCardService: GiftCardService, private authService:AuthServiceService){
    this.giftCardService.selectedGiftCards$.subscribe(cards => {
      this.showBtn = cards.length > 0;
    })
  }

  addGiftCardToUser(){
    this.loading = true;
    this.giftCardService.selectedGiftCards$.pipe(first()).subscribe(cards => {
      const selectedIds = cards.map(card => String(card.id));
      let idUser = this.authService.getIdUser();

      this.authService.setGiftCardsUser(selectedIds, idUser).subscribe((res:any) => {
        this.loading = false;
        if(res && res.token){
          Swal.fire({
            title: '¡Éxito!',
            text: 'Las GiftCards fueron agregadas correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        }
        window.location.reload();
      }, err => {
        this.loading = true;
              Swal.fire({
                title: '¡Error!',
                text: 'Hubo un error al agregar las GiftCards.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
      });
    });
  }

}
