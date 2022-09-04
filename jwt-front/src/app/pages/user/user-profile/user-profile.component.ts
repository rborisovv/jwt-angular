import {Component, OnInit} from '@angular/core';
import {faCamera, faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {AuthService} from "../../../service/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  faSignInAlt = faSignInAlt;
  faCamera = faCamera;

  public user: User;
  public authorities: string[];
  private jwtService: JwtHelperService;

  constructor(private userService: UserService, private authService: AuthService) {
    this.user = this.obtainCurrUserData();
    this.jwtService = new JwtHelperService();
    this.authorities = [];
    this.authorities = this.obtainUserAuthorities();
  }

  ngOnInit(): void {

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
