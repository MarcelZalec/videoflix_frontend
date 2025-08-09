import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { SignupModel, LoginModel } from '../models/login.model';
import * as Config from '../config';
import { LittleHelpersService } from './little-helpers.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  /**
   * Performs user login by posting credentials to the backend.
   * Stores token in local or session storage based on `remember` flag.
   * @param user LoginModel containing user credentials and remember preference.
   * @returns Observable of server response.
   */
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

  /**
   * Logs the user out by removing authentication tokens from local and session storage.
   */
  logout() {
    const storage = sessionStorage;
    const storage2 = localStorage;
    storage.removeItem('token')
    storage2.removeItem('token')
  }

  /**
   * Registers a new user and shows a toast notification upon success.
   * @param user SignupModel containing user registration information.
   * @returns Observable of server response.
   */
  register(user: SignupModel): Observable<Object> {
    return this.http.post(`${Config.FULL_REGISTRATION_URL}`, user).pipe(
      tap((r)=> {
        this.lh.showToastSignal('Activation Mail send')
      })
    )
  }

  /**
   * Resets the user's password using a token and the new password data.
   * Shows a success or error toast notification depending on the result.
   * @param token Password reset token provided to the user.
   * @param reset New password or password object to submit.
   * @returns Promise resolving with the HTTP response.
   */
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

  /**
   * Initiates the password reset flow by sending the user's email.
   * This request bypasses any HTTP interceptors.
   * @param email Email address of the user requesting password reset.
   * @returns Promise resolving with the HTTP response.
   */
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

  /**
   * Retrieves the authentication token from local or session storage.
   * @returns The token if present, otherwise null.
   */
  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Validates the provided token by posting it to the authorization endpoint.
   * @param token Authentication token to validate.
   * @returns Observable of the HTTP response.
   */
  validateToken(token:string): Observable<any> {
    const headers = {Authorization: 'Token '+ token};
    const url = `${Config.FULL_AUTHORIZATION_URL}`;
    const body = {token};
    return this.http.post<any>(url, body , {
      headers: headers,
      observe: 'response',
    });
  }

  /**
   * Automatically logs the user in if a valid token is found in local storage.
   * @returns Boolean indicating whether auto-login was successful.
   */
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

  /**
   * Checks whether the backend server is reachable.
   *
   * Sends a GET request to the configured backend URL. If the server responds successfully,
   * the response is logged to the console. If an error occurs (e.g., server is offline or
   * a network issue), a toast notification is shown and the error is logged.
   *
   * This method uses RxJS operators to handle errors gracefully without breaking the observable stream.
   *
   * @returns void
   */
  checkBackendOnlineStatus() {
    this.http.get(`${Config.STATIC_BASE_URL}`, { responseType: 'text' })
      .pipe(
        catchError(error => {
          this.lh.showToastSignal(`❌ Backend server is offline or an error occurred`, 0);
          console.info("Backend server is offline")
          //console.error("Error during backend check:", error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response !== null) {
          // this.lh.showToastSignal(`Backend server is online`);
          // console.log("✅ Backend is reachable:", response);
        }
      });
  }
}
