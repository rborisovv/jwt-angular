import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpResponse} from "@angular/common/http";

import {environment} from "../../environments/environment";

import {Observable} from "rxjs";
import {User} from "./model/user";
import {ICustomHttpResponse} from "./model/custom-http-response";


@Injectable()
export class UserService {
  private apiHost = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getUser(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.apiHost}/user/list`);
  }

  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.apiHost}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.apiHost}/user/update`, formData);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<any> | HttpErrorResponse> {
    return this.http.post<User>(`${this.apiHost}/user/updateProfileImage`, formData,
      {reportProgress: true, observe: 'events'});
  }

  public deleteUser(userId: number): Observable<ICustomHttpResponse | HttpErrorResponse> {
    return this.http.delete<ICustomHttpResponse>(`${this.apiHost}/user/delete/${userId}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] | null {
    const users: User[] = JSON.parse(<string>localStorage.getItem('users'));
    if (localStorage.getItem('users')) {
      return users;
    }
    return null;
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.nonLocked));
    return formData;
  }
}
