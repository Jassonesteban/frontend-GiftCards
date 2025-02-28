import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftCardComponent } from '../../components/gift-card/gift-card.component';
import { MyGiftCardsService } from '../../services/my-gift-cards.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { GiftCardService } from '../../services/gift-card.service';
import { GiftCard } from '../../interfaces/GiftCard';
import { user } from '../../interfaces/User';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-giftcards',
  imports: [CommonModule, GiftCardComponent],
  templateUrl: './my-giftcards.component.html',
  styleUrl: './my-giftcards.component.css',
})
export class MyGiftcardsComponent {
  isOpen = false;
  isLogin = true;
  giftCardsInfo: GiftCard[] = [];

  constructor(
    private myGiftCardService: MyGiftCardsService,
    private authService: AuthServiceService,
    private giftCardService: GiftCardService
  ) {}

  ngOnInit(): void {
    this.myGiftCardService.modalState.subscribe((state) => {
      this.isOpen = state.isOpen;
      this.isLogin = state.isLogin;
    });

    this.getInfoUser();
  }

  getInfoUser() {
    let idUser = this.authService.getIdUser();

    if (idUser !== null) {
      this.authService.getInfoUser(idUser).subscribe((user: user) => {
        if (user.cardIds && user.cardIds.length > 0) {
          let requests = user.cardIds.map((id) =>
            this.giftCardService.getInfoGiftCardById(id)
          );

          forkJoin(requests).subscribe(
            (cards) => {
              this.giftCardsInfo = cards;
            },
            (error) => {
              console.log('Hubo un error obteniendo los detalles ', error);
            }
          );
        }
      });
    } else {
      return;
    }
  }

  getInfoGiftCard(idGiftCard: string) {
    this.giftCardService.getInfoGiftCardById(idGiftCard);
  }

  closeModal() {
    this.myGiftCardService.closeModal();
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;
  }
}
