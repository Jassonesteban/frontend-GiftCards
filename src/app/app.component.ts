import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { HomeComponent } from "./pages/home/home.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MyGiftcardsComponent } from "./pages/my-giftcards/my-giftcards.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, AuthComponent, HomeComponent, FooterComponent, MyGiftcardsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GiftCards | Grupo Exito';
}
