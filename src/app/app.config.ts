import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';

// Create interceptor functions
const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Add auth header with jwt if account is logged in and request is to the api url
  const account = JSON.parse(localStorage.getItem('account') || '{}');
  const isLoggedIn = account?.token;
  const isApiUrl = req.url.startsWith('http://localhost:4000');
  if (isLoggedIn && isApiUrl) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${account.token}` }
    });
  }
  return next(req);
};

const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

export const config: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    )
  ]
}; 