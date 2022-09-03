import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";

import {environment} from "../../environments/environment";

import {Observable} from "rxjs";
import {User} from "./model/user";

@Injectable()
export class AuthService {
  public apiHost: string = environment.apiUrl;
  private token: string | undefined;
  private loggedInUsername: string | null | undefined;
  private jwtService = new JwtHelperService();

  constructor(private http: HttpClient) {

  }

  public login(user: User): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.apiHost}/user/login`, user, {observe: 'response'});
  }

  public register(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.apiHost}/user/register`, user);
  }

  public logout(): void {
    this.token = undefined;
    this.loggedInUsername = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('users');
  }

  public saveToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    // @ts-ignore
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = <string>localStorage.getItem('token');
  }

  public getToken(): string {
    return <string>this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    const subject = this.jwtService.decodeToken(this.token).sub;
    if (this.token != null && this.token !== '') {
      if (subject != null || '') {
        if (!this.jwtService.isTokenExpired(this.token)) {
          this.loggedInUsername = subject;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
    return false;
  }
}
