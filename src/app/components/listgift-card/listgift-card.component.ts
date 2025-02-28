import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GiftCardService } from '../../services/gift-card.service';
import { GiftCardResponse } from '../../interfaces/GiftCardResponse';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { AuthModalService } from '../../services/auth-modal.service';
import { Subscription, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-listgift-card',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './listgift-card.component.html',
  styleUrl: './listgift-card.component.css'
})
export class ListgiftCardComponent implements OnInit, OnDestroy  {
  isLoggedIn = false;
  @Input() giftCards: GiftCardResponse[] = [];
  @Output() giftCardSelected = new EventEmitter<GiftCardResponse[]>();

  pageSize: number = 12;
  currentPage: number = 1;
  @Input() state: boolean = false;
  rolUserId: any = 0;

  selectedGiftCards: Record<string, boolean> = {};
  private subscriptions: Subscription[] = [];
  editingGiftCardId:number | null = null;
  editedGiftCard:any = {};
  editingIndex: { [key: number]: boolean } = {};

  constructor( private authModalService: AuthModalService,private router: Router, private giftCardService: GiftCardService, private authService: AuthServiceService) {}

  get paginatedGiftCards() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.giftCards.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.giftCards.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ngOnInit(): void {

    this.rolUserId = this.authService.getRolUser();

    this.subscriptions.push(
      this.authService.isAuthenticated().subscribe(status => {
        this.isLoggedIn = status;
      })
    )

    this.subscriptions.push(
     this.giftCardService.selectedGiftCards$.subscribe(cards => {
      this.selectedGiftCards = cards.reduce((acc, card) => {
        acc[card.id] = true;
        return acc;
      }, {} as Record<string, boolean>)
     })
    );

    this.giftCardService.getGiftCards().subscribe((data) => {
      this.giftCards = data;
    });

    this.authService.getRolUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onGiftCardClick(giftCard: GiftCardResponse): void {
    if(!this.isLoggedIn){
      this.openLogin();
      return;
    }

    this.selectedGiftCards[giftCard.id] = !this.selectedGiftCards[giftCard.id];
    const updatedSelection = this.giftCards.filter(card => this.selectedGiftCards[card.id]);
    this.giftCardService.updateSelectedGiftCards(updatedSelection);
    this.giftCardSelected.emit(updatedSelection);
  }

  deleteGiftCard(idGiftCard: any): void {
    Swal.fire({
      title: "Eliminar Tarjeta de Regalo",
      text: "¿Estas seguro de esta acción?, no se revertira",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar tarjeta",
    }).then((result) => {
      if (result.isConfirmed) {
        this.giftCardService.deleteGiftCard(idGiftCard).subscribe(res => {
          console.log(res);
          Swal.fire({
            title: "Eliminada!",
            text: "La tarjeta de regalo ha sido eliminada.",
            icon: "success"
          });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
      }
    });
  }

  editGiftCard(index: number) {
    this.editingIndex[index] = true;
  }

  saveGiftCard(index: number, giftCard: any) {
    this.editingIndex[index] = false;
    this.giftCardService.updateGiftCard(giftCard).subscribe(res => {
      console.log(res);
    })
  }

  openLogin() {
    this.authModalService.openModal(true);
  }

}
