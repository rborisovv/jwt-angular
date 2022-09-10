import {Component, OnDestroy, OnInit} from '@angular/core';
import {faCamera, faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {AuthService} from "../../../service/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  faSignInAlt = faSignInAlt;
  faCamera = faCamera;

  public user: User;
  public authorities: string[];
  private jwtService: JwtHelperService;
  private subscriptions: Subscription[];
  public file!: File;
  public showLoading: boolean;
  public pageTitle: string;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.user = this.obtainCurrUserData();
    this.jwtService = new JwtHelperService();
    this.authorities = [];
    this.authorities = this.obtainUserAuthorities();
    this.showLoading = false;
    this.subscriptions = [];
    this.pageTitle = 'Profile';
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onUpdateUser(user: User): void {
    const cachedUser: User = this.authService.getUserFromLocalCache();
    const formData: FormData = this.userService.createUserFormData(cachedUser.username, user, this.file);

    this.userService.updateUser(formData).subscribe({
      next: response => {
        this.user = response;
        this.authService.removeUserFromLocalCache();
        this.authService.addUserToLocalCache(this.user);
        window.location.reload();
      }
    })
  }

  public onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  public updateProfileImage(): void {
    // @ts-ignore
    document.getElementById('file-upload').click();
  }

  public onFileChanged(event: Event): void {
    // @ts-ignore
    this.file = event.target.files[0];
  }

  private obtainUserAuthorities(): string[] {
    this.authService.loadToken();
    const token: string = this.authService.getToken();
    const tokenClaims = JSON.parse(window.atob(token.split('.')[1]));

    return tokenClaims.Authorities;
  }

  private obtainCurrUserData(): User {
    return this.authService.getUserFromLocalCache();
  }
}
