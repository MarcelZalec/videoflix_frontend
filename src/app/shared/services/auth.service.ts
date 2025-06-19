import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { SignupModel, LoginModel } from '../models/login.model';
import * as Config from '../config';
import { LittleHelpersService } from './little-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClientWithoutInterceptor: HttpClient;

  constructor(
    private http: HttpClient,
    private httpBackend: HttpBackend,
    private lh: LittleHelpersService
  ) {
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

  logout() {
    const storage = sessionStorage;
    const storage2 = localStorage;
    storage.removeItem('token')
    storage2.removeItem('token')
  }
  
  register(user: SignupModel): Observable<Object> {
    return this.http.post(`${Config.FULL_REGISTRATION_URL}`, user).pipe(
      tap((r)=> {
        this.lh.showToastSignal('Activation Mail send')
      })
    )
  }

  async resetPassword(token:string, reset:any): Promise<any> {
    const url = `${Config.FULL_RESETPASS_URL}${token}`
    const body = {'password': reset}
    try {
      const response = await firstValueFrom(
        this.http.post<any>(url, body, {
          observe: 'response'
        })
      )
      if(response.status === 200) {
        this.lh.showToastSignal('Password changed successfully')
      }
      return response
    } catch (e:any) {
      this.lh.showToastSignal(e['error'].error)
      throw e;
    }
  }

  async forgetPass(email: string): Promise<any> {
    const body = { email };
    const link = `${Config.FULL_RESETPASS_URL}`;
    try {
      const response = await firstValueFrom(
        this.httpClientWithoutInterceptor.post<any>(link, body, {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
        })
      );
      return response;
    } catch (error) {
      console.error('Request-Fehler:', error);
      throw error;
    }
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  validateToken(token:string): Observable<any> {
    const headers = {Authorization: 'Token '+ token};
    const url = `${Config.FULL_AUTHORIZATION_URL}`;
    const body = {token};
    return this.http.post<any>(url, body , {
      headers: headers,
      observe: 'response',
    });
  }

  autoLogin() {
    const token = localStorage.getItem('token')
    if (token != null) {
      if(this.validateToken(token)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
