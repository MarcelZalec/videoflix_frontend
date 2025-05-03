import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClientWithoutInterceptor: HttpClient;
  API_BASE_URL = 'http://127.0.0.1:8000/api/';
  STATIC_BASE_URL = 'http://127.0.0.1:8000/';
  LOGIN_URL = 'login/';
  REGISTER_URL='registration/';

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpClientWithoutInterceptor = new HttpClient(httpBackend);
  }

  login(user: any) {
    return this.http
      .post<any>(`${this.API_BASE_URL}/login/`, user)
      .pipe(
        tap((response)=> {
          const storage = user.remeber ? localStorage : sessionStorage;
          storage.setItem('token', response.token)
        })
      )
  }  
}
