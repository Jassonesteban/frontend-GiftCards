import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private isOpenPanel = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenPanel.asObservable();

  openPanel() {
    this.isOpenPanel.next(true);
  }

  closePanel() {
    this.isOpenPanel.next(false);
  }

  constructor() { }
}
