import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {

  private modalStateSource = new BehaviorSubject<{ isOpen: boolean; isLogin: boolean }>({
    isOpen: false,
    isLogin: true,
  });

  modalState = this.modalStateSource.asObservable();

  openModal(isLogin: boolean) {
    this.modalStateSource.next({ isOpen: true, isLogin });
  }

  closeModal() {
    this.modalStateSource.next({ isOpen: false, isLogin: true });
  }
}
