import {inject} from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/TokenStorageService.service';

export const authGuard = () => {
  const authService = inject(TokenStorageService);
  const router = inject(Router);
console.log("authGuard "+authService.isLoggedIn);
  if (authService.isLoggedIn) {
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/login');
  };