import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GiftCardResponse } from '../interfaces/GiftCardResponse';
import { GiftCard } from '../interfaces/GiftCard';

@Injectable({
  providedIn: 'root'
})
export class GiftCardService {

  private selectedGiftCardsSubject = new BehaviorSubject<GiftCardResponse[]>([]);
  selectedGiftCards$ = this.selectedGiftCardsSubject.asObservable();

  private apiURL = "http://localhost:8081/api/v1/tarjetas";

  constructor(private http: HttpClient) { }

  getGiftCards():Observable<GiftCardResponse[]>{
    return this.http.get<GiftCardResponse[]>(this.apiURL);
  }

  addGiftCard(giftCard: GiftCardResponse) {
    const currentSelection = this.selectedGiftCardsSubject.value;
    if (!currentSelection.some((card) => card.id === giftCard.id)) {
      this.selectedGiftCardsSubject.next([...currentSelection, giftCard]);
    }
  }

  removeGiftCard(giftCardId: number) {
    const updatedSelection = this.selectedGiftCardsSubject.value.filter((card) => card.id !== giftCardId);
    this.selectedGiftCardsSubject.next(updatedSelection);
  }

  clearGiftCards() {
    this.selectedGiftCardsSubject.next([]);
  }

  updateSelectedGiftCards(cards: GiftCardResponse[]) {
    this.selectedGiftCardsSubject.next(cards);
  }

  getSelectedGiftCards(): GiftCardResponse[] {
    return this.selectedGiftCardsSubject.getValue();
  }

  getInfoGiftCardById(idGiftCard: any): Observable<GiftCard>{
    return this.http.get<GiftCard>(`${this.apiURL}/${idGiftCard}`);
  }
}
