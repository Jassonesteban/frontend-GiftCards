import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = "http://localhost:8080/api/v1/usuarios";

  constructor(private http: HttpClient) { }

  deleteUser(id:string) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  updateUser(id:number, data:any){
    return this.http.put(`${this.apiURL}/update/${id}`, data);
  }
}
