import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../service/auth.service";
import {NotificationService} from "../service/notification.service";
import {NotificationTypeEnum} from "../enum/notification-type.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  message: string = 'You need to be logged in to access this page'.toUpperCase();

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return true;
  }

  private isUserLoggedIn(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']).then(() => this.notificationService.notify(NotificationTypeEnum.INFO, this.message));
    //TODO: The above is just a check if it will work with a then statement. The below is the working one!
    // this.notificationService.notify(NotificationTypeEnum.INFO, this.message);
    return false;
  }
}
