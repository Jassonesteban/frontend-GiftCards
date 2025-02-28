import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GiftCardResponse } from '../interfaces/GiftCardResponse';
import { GiftCard } from '../interfaces/GiftCard';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class GiftCardService {

  private selectedGiftCardsSubject = new BehaviorSubject<GiftCardResponse[]>([]);
  selectedGiftCards$ = this.selectedGiftCardsSubject.asObservable();

  private apiURL = "http://localhost:8081/api/v1/tarjetas";

  constructor(private http: HttpClient, private authService: AuthServiceService) { }

  getGiftCards():Observable<GiftCardResponse[]>{
    return this.http.get<GiftCardResponse[]>(this.apiURL);
  }

  createGiftCard(giftCard: GiftCard): Observable<GiftCard> {

    return this.http.post<GiftCard>(`${this.apiURL}/create`, giftCard, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
       })
    });
  }

  updateGiftCard(giftCard: GiftCard) {
    return this.http.put(`${this.apiURL}/update/${giftCard.id}`, giftCard);
  }

  deleteGiftCard(idGiftCard: any){
    return this.http.delete(`${this.apiURL}/delete/${idGiftCard}`, { responseType: 'text' });
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
