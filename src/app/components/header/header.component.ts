import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { MyGiftCardsService } from '../../services/my-gift-cards.service';
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userName:string | null = null;
  userData:any = null;
  rolUser:any = null;

  constructor(private panelService:PanelService, private myGifsCardService: MyGiftCardsService, private authModalService: AuthModalService, private authService:AuthServiceService){}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(status => {
      this.isLoggedIn = status;
    });

   this.authService.getUser().subscribe(user => {
    this.userData = user;
    this.userName = user ? user.username : "No logueado"
   });

   this.rolUser = this.authService.getRolUser();
  }

  logout(){
    this.authService.logout();
  }

  openLogin() {
    this.authModalService.openModal(true);
  }

  openRegister() {
    this.authModalService.openModal(false);
  }

  openMyGiftCards(){
    this.myGifsCardService.openModal(true);
  }

  openPanelCreatedGiftCards(){
    this.panelService.openPanel();
  }

}
