import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes(`${this.authService.apiHost}/user/login`)) {
      return next.handle(request);
    }

    if (request.url.includes(`${this.authService.apiHost}/user/register`)) {
      return next.handle(request);
    }

    this.authService.loadToken();
    const token: string = this.authService.getToken();
    const clonedRequest: HttpRequest<unknown> = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return next.handle(clonedRequest);
  }
}
