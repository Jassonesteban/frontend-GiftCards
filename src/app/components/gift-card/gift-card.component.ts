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
    private emailService: EmailService
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
      this.authService.setGiftCardsUser(updatedCardIds, idUser);
      this.isLoading = false;
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
    );
    const companyUppercase = card.company.toUpperCase();
    const formattedDate = new Date(card.expiresAt).toLocaleDateString();

    const emailBody = `
    <div
  style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
  "
>
  <div
    style="
      background-color: rgb(77, 170, 119);
      color: white;
      padding: 10px;
      text-align: center;
      font-size: 20px;
      border-radius: 10px 10px 0 0;
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6"
    >
      <path
        d="m15 1.784-.796.795a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.021.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z"
      />
    </svg>

    ¡Tu tarjeta de regalo está lista!
  </div>
  <div style="padding: 20px; color: #333">
    <p>Estimado/a <strong>${this.InfoUser.username}</strong>,</p>
    <p>
      Nos complace informarle que su tarjeta de regalo ha sido activada con
      éxito. A continuación, encontrará los detalles:
    </p>
    <div
      style="
        background-color: #ffffff;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
        border: 1px solid #ddd;
      "
    >
      <p>
        <strong
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
              clip-rule="evenodd"
            />
          </svg>
          Empresa:</strong
        >
        ${companyUppercase}
      </p>
      <p>
        <strong>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
            />
          </svg>
          Código:</strong
        >
        <span style="color: rgb(63, 110, 25); font-size: 18px"
          >${card.code}</span
        >
      </p>
      <p>Valor: ${formattedAmount}</p>
      <p>
        <strong>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            />
            <path
              fill-rule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clip-rule="evenodd"
            />
          </svg>

          Válida hasta:</strong
        >
        ${formattedDate}
      </p>
      <p>
        <strong>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
          </svg>
          Canjeable en:</strong
        >
        ${card.company}
      </p>
    </div>
    <p>
      Para redimir su tarjeta, utilice el código en la tienda o plataforma
      correspondiente antes de la fecha de vencimiento.
    </p>
  </div>
  <div
    style="text-align: center; font-size: 12px; color: #777; margin-top: 20px"
  >
    © 2025 Prueba tecnica para GRUPO EXITO | Creado por Jasson Esteban Gualguan
    Guzmán
  </div>
</div>

  `;
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
