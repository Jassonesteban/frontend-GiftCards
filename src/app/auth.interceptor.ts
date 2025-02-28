import {HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';

const PUBLIC_ROUTES = [
  '/api/v1/tarjetas',
  '/api/v1/usuarios/login',
  '/api/v1/usuarios/registro'
];

export const AuthInterceptor:HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  if (PUBLIC_ROUTES.includes(req.url)) {
    return next(req);
  }

  const reqAurh = token
  ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  : req;

  return next(reqAurh);
}
