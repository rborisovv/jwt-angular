import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {AuthService} from "../../../service/auth.service";
import {NotificationService} from "../../../service/notification.service";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, OnDestroy {

  @Input() public updateUser: User = new User();
  public profilePicture!: File;
  private subscriptions: Subscription[];

  constructor(private authService: AuthService, private userService: UserService, private notificationService: NotificationService) {
    this.updateUser = new User();
    this.subscriptions = [];
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onUserUpdate(user: User): void {
    console.log(user)
    const cachedUser: User = this.authService.getUserFromLocalCache();
    const formData: FormData = this.userService.createUserFormData(cachedUser.username, user, this.profilePicture);
    const subscription: Subscription = this.userService.updateUser(formData).subscribe({
      next: response => {
        this.notificationService.notify(NotificationTypeEnum.SUCCESS, `Successfully updated user ${response.username}!`);
        if (this.profilePicture) {
          this.authService.addUserToLocalCache(response);
          window.location.reload();
        }
      }, error: () => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, `Error updating user ${user.username}`);
      }
    });

    this.subscriptions.push(subscription);
  }

  public onPictureChange(event: Event): void {
    // @ts-ignore
    this.profilePicture = event.target.files[0];
  }
}
