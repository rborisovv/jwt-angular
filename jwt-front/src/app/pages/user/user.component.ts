import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationTypeEnum} from "../../enum/notification-type.enum";
import {
  faEdit,
  faEnvelope,
  faFileExcel,
  faIdBadge,
  faLock,
  faPlus,
  faSpinner,
  faSync,
  faTrash,
  faUnlock,
  faWrench
} from "@fortawesome/free-solid-svg-icons";
import {User} from "../../model/user";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  faPlus = faPlus;
  faSpin = faSpinner;
  faSync = faSync;
  faEdit = faEdit;
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUnlock = faUnlock;
  faTrash = faTrash;
  faWrench = faWrench;
  faExcel = faFileExcel;

  public users: User[];
  private subscriptions: Subscription[];

  constructor(private router: Router, private authenticationService: AuthService,
              private userService: UserService, private notificationService: NotificationService) {
    this.users = this.fetchUsers();
    this.subscriptions = [];
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private fetchUsers(): User[] {
    const users: User[] = [];
    this.userService.getUsers().subscribe({
      next: response => {
        this.notificationService.notify(NotificationTypeEnum.SUCCESS, `Successfully fetched ${response.length} entries!`);
        response.forEach(user => users.push(user));
      },
      error: errorResponse => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, errorResponse.error.message);
      }
    });
    return users;
  }
}
