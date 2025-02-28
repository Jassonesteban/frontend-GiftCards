import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { user } from '../interfaces/User';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiURL = "http://localhost:8080/api/v1/usuarios";
  private authState = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);
  private selectedGiftCardsSubject = new BehaviorSubject<{ [key: string]: boolean }>({});
  selectedGiftCards$ = this.selectedGiftCardsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private successSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.authState.next(this.hasValidToken());
    this.loadUserData();
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/registro`, userData, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveUserData(response);
        }
      })
    );
  }

  loginUser(email: string, password: string) {
    return this.http.post(`${this.apiURL}/login`, { email, password }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.saveUserData(response);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }

  get loading$() {
    return this.loadingSubject.asObservable();
  }

  get success$() {
    return this.successSubject.asObservable();
  }

  setGiftCardsUser(idsCards:any, idUser:any){
    this.loadingSubject.next(true);
    const formattedIds = idsCards.map(String);
    return this.http.put(`${this.apiURL}/${idUser}/add-cards`, formattedIds, {withCredentials:true, observe:'response'});
  }

  getInfoUser(idUser:any):Observable<user>{
    return this.http.get<user>(`${this.apiURL}/me/${idUser}`);
  }

  private saveUserData(response: any) {
    const encodedData = btoa(JSON.stringify(response));
    this.cookieService.set('userData', encodedData, { path: '/', expires: 7, secure: true, sameSite: 'Strict' });
    this.authState.next(true);
    this.loadUserData();
    this.router.navigate(['/home']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  hasValidToken():boolean{
    if(!this.cookieService){
      return false;
    }
    return this.cookieService.check("userData");

  }

  getUserData(): any {
    const cookieData = this.cookieService.get('userData');
    return cookieData ? JSON.parse(atob(cookieData)) : null;
  }

  getUser():Observable<any>{
    return this.userSubject.asObservable();
  }

  private loadUserData(){
    const user = this.getUserData();
    this.userSubject.next(user);
  }

  getToken(): string | null {
    const userData = this.getUserData();
    return userData ? userData.token : null;
  }

  getIdUser():string | null {
    const userData = this.getUserData();
    return userData ? userData.id : null;
  }

  getRolUser():string | null {
    const userData = this.getUserData();
    return userData ? userData.rolId : null;
  }

  resetSelectedGiftCards() {
    this.selectedGiftCardsSubject.next({});
  }

  logout() {
    this.cookieService.delete("userData");
    this.authState.next(false);
    this.userSubject.next(null);
    this.resetSelectedGiftCards();
    this.router.navigate(['/']);
  }

  updateSelectedGiftCards(newSelection: { [key: string]: boolean }) {
    this.selectedGiftCardsSubject.next(newSelection);
  }
}
