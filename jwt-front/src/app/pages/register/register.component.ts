import {Component, OnDestroy, OnInit} from '@angular/core';
import {faEnvelope, faIdCard, faSpinner, faUser} from "@fortawesome/free-solid-svg-icons";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {NotificationService} from "../../service/notification.service";
import {User} from "../../model/user";
import {NotificationTypeEnum} from "../../enum/notification-type.enum";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faIdCard = faIdCard;
  faEnvelope = faEnvelope;
  faSpin = faSpinner;

  public showLoading!: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService,
              private notifierService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  public onRegister(user: User): void {
    this.showLoading = true;

    const subscription = this.authService.register(user).subscribe({
        next: response => {
          this.showLoading = false;
          this.router.navigateByUrl('/login');
          this.sendNotification(NotificationTypeEnum.SUCCESS, `A new account was created successfully for ${response.firstName} ${response.lastName}!`);
        },
        error: response => {
          this.sendNotification(NotificationTypeEnum.ERROR, response.error.message);
          this.showLoading = false;
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private sendNotification(notificationType: NotificationTypeEnum, message: string) {
    if (message) {
      this.notifierService.notify(notificationType, message);
    } else {
      const errorMessage = 'An Error Occurred. Please try again';
      this.notifierService.notify(notificationType, errorMessage);
    }
  }
}
