import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {AuthService} from "../../../service/auth.service";
import {NotificationService} from "../../../service/notification.service";
import {NotificationTypeEnum} from "../../../enum/notification-type.enum";
import {RoleEnum} from "../../../enum/role.enum";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  public roles: string[];
  private userProfileImg!: File;

  @Input() addUser: User = new User();

  constructor(private userService: UserService, private authService: AuthService, private notificationService: NotificationService) {
    this.roles = [RoleEnum.USER, RoleEnum.HR, RoleEnum.MANAGER, RoleEnum.ADMIN, RoleEnum.OWNER];
  }

  ngOnInit(): void {
  }

  public onAddNewUser(user: User): void {
    const cachedUsername: string = this.authService.getUserFromLocalCache().username;
    const formData: FormData = this.userService.createUserFormData(cachedUsername, user, this.userProfileImg);
    this.userService.addUser(formData).subscribe({
      next: () => {
        this.notificationService.notify(NotificationTypeEnum.SUCCESS, `Successfully created user ${user.username}!`);
        window.location.reload();
      }, error: errorResponse => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, errorResponse.error.message);
      }
    });
  }

  public onUserImageChange(event: Event): void {
    // @ts-ignore
    this.userProfileImg = event.target.files[0];
  }
}
