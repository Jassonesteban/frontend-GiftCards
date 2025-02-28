import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MyGiftCardsService } from '../../services/my-gift-cards.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { EmailService } from '../../services/email.service';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emailTemplate } from '../../assets/templates/email-template';

registerLocaleData(localeEsCO, 'es-CO');

@Component({
  selector: 'app-gift-card',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css',
})
export class GiftCardComponent {
  profileForm: FormGroup;
  isLoggedIn = false;
  @Input() giftCards: any[] = [];
  InfoUser: any = [];
  currentPage = 0;
  cardsPerPage = 4;

  showModal = false;
  isLoading = false;

  loadingStates: { [key: string]: boolean } = {};

  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private myGiftsCardsService: MyGiftCardsService,
    private authService: AuthServiceService,
    private emailService: EmailService,
  ) {
    this.profileForm = this.fb.group({
      username: [this.InfoUser.username, Validators.required],
      email: [this.InfoUser.email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.InfoUser = user;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  removeGiftCard(cardId: string) {
    this.isLoading = true;
    this.giftCards = this.giftCards.filter((card) => card.id !== cardId);
    let idUser = this.authService.getIdUser();

    if (idUser) {
      const updatedCardIds = this.giftCards.map((card) => card.id);
      this.authService.setGiftCardsUser(updatedCardIds, idUser).subscribe( res => {
        this.isLoading = false;
        window.location.reload();
      });
    }
  }

  enviarEmail(card: any) {
    this.isLoading = true;
    const currencyPipe = new CurrencyPipe('es-CO');
    const formattedAmount = currencyPipe.transform(
      card.amount,
      'COP',
      'symbol',
      '1.0-0'
    ) ?? '';
    const companyUppercase = card.company.toUpperCase();
    const formattedDate = new Date(card.expiresAt).toLocaleDateString();

    const emailBody = emailTemplate.getGitfCardTemplate(this.InfoUser.username, companyUppercase, card.code, formattedAmount, formattedDate,card.company)

    this.emailService
      .sendEmail(
        this.InfoUser.email,
        `Tienes tarjetas de regalo activas`,
        emailBody
      )
      .subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: `Se ha enviado un correo con los detalles de la tarjeta a ${this.InfoUser.email}.`,
            confirmButtonColor: '#007bff',
          });

          this.removeGiftCard(card.id);

        },
        (error) => {
          this.isLoading = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el correo. Intente nuevamente más tarde.',
            confirmButtonColor: '#d33',
          });
        }
      );
  }

  closeModal() {
    this.myGiftsCardsService.closeModal();
  }

  get paginatedGiftCards() {
    const start = this.currentPage * this.cardsPerPage;
    return this.giftCards.slice(start, start + this.cardsPerPage);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.cardsPerPage < this.giftCards.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  hasMorePages() {
    return (this.currentPage + 1) * this.cardsPerPage < this.giftCards.length;
  }

  deleteAccountUser(idUser: any) {
    Swal.fire({
      title: 'ATENCION',
      text: '¿Quieres eliminar tu cuenta?, se perderan tus GiftCards',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(idUser).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminada!',
              text: 'Tu cuenta fue borrada.',
              icon: 'success',
            });
            setTimeout(() => {
              this.authService.logout();
              window.location.reload();
            }, 3000);
          },
          error: (err) => {
            Swal.fire({
              title: 'Hubo un error!',
              text: 'Tu cuenta no fue borrada.',
              icon: 'error',
            });
          },
        });
      }
    });
  }

  updateAccoutUser(idUser: number): void {
    const formattedData: any = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
    };

    Swal.fire({
      title: 'Actualizar perfil',
      text: 'Quieres actualizar la informacion de tu cuenta?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isEditing = false;
        if (this.profileForm.valid) {
          this.userService.updateUser(idUser, formattedData).subscribe({
            next: () => {
              Swal.fire({
                title: 'Actualizada!',
                text: 'Vuelve a iniciar sesion',
                icon: 'success',
              });

             setTimeout(() => {
                this.authService.logout();
                window.location.reload();
              }, 3000);
            },
            error: () => {
              Swal.fire({
                title: 'Hubo un error!',
                text: 'Tu cuenta no fue actualizada.',
                icon: 'error',
              });
            },
          });
        }
      }
    });
  }
}
