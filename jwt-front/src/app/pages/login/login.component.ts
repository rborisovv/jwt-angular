import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {NotificationService} from "../../service/notification.service";
import {faKey, faSpinner, faUser} from "@fortawesome/free-solid-svg-icons";
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {NotificationTypeEnum} from "../../enum/notification-type.enum";
import {HeaderTypeEnum} from "../../enum/header-type.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faKey = faKey;
  faSpin = faSpinner;

  public showLoading!: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService,
              private notifierService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;

    const subscription = this.authService.login(user).subscribe({
        next: response => {
          const token = response.headers.get(HeaderTypeEnum.JWT_TOKEN);
          this.authService.saveToken(<string>token);
          if (response.body) {
            this.authService.addUserToLocalCache(response.body);
          }
          this.router.navigateByUrl('/user/management');
          this.showLoading = false;
        },
        error: response => {
          this.sendErrorNotification(NotificationTypeEnum.ERROR, response.error.message);
          this.showLoading = false;
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private sendErrorNotification(notificationType: NotificationTypeEnum, message: string) {
    if (message) {
      this.notifierService.notify(notificationType, message);
    } else {
      const errorMessage = 'An Error Occurred. Please try again';
      this.notifierService.notify(notificationType, errorMessage);
    }
  }
}
