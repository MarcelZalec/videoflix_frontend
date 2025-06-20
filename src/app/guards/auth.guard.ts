import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { lastValueFrom } from 'rxjs';

/**
 * Authentication guard that checks whether a valid token is present.
 * 
 * If the token is valid, access is granted. Otherwise, the user is redirected to the login page.
 *
 * @param {ActivatedRouteSnapshot} route - The currently activated route.
 * @param {RouterStateSnapshot} state - The current router state.
 * @returns {Promise<boolean>} - A promise that resolves to true if access is allowed, otherwise false.
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const as = inject(AuthService)
  const router = inject(Router)
  const token = as.getToken()
  
  if(token) {
    try {
      const response = await lastValueFrom(as.validateToken(token))
      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log("Invalid token", error);
      router.navigateByUrl('login')
      return false
    }
  } else {
    router.navigateByUrl('login')
    return false;
  }
};
