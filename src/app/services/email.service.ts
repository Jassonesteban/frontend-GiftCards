import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiURL = "http://localhost:8080/api/email";

  constructor(private http: HttpClient) { }

  sendEmail(to:string, subject:string, body:string):Observable<any>{
    const emailData = {to, subject, body};
    return this.http.post(`${this.apiURL}/send`, emailData);
  }
}
