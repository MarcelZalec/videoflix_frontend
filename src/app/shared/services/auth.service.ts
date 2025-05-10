import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SignupModel, LoginModel } from '../models/login.model';
import * as Config from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClientWithoutInterceptor: HttpClient;

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpClientWithoutInterceptor = new HttpClient(httpBackend);
  }

  login(user: LoginModel) {
    return this.http
      .post<any>(`${Config.FULL_LOGIN_URL}`, user)
      .pipe(
        tap((response)=> {
          const storage = user.remember ? localStorage : sessionStorage;
          storage.setItem('token', response.token)
        })
      )
  }
  
  register(user: SignupModel): Observable<Object> {
    return this.http.post(`${Config.FULL_REGISTRATION_URL}`, user)
  }

  forgetPass(email:string) {
    return this.http.post(`${Config.FULL_REGISTRATION_URL}`, email)
  }
}
