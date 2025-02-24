import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GiftCard } from '../../interfaces/GiftCard';
import { GiftCardService } from '../../services/gift-card.service';
import { GiftCardResponse } from '../../interfaces/GiftCardResponse';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { AuthModalService } from '../../services/auth-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listgift-card',
  imports: [CommonModule],
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

  selectedGiftCards: Record<string, boolean> = {};
  private subscriptions: Subscription[] = [];

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

  openLogin() {
    this.authModalService.openModal(true);
  }

}
