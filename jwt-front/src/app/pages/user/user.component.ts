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
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthoritiesEnum} from "../../enum/authorities.enum";

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
  public username: string;
  public selectedUser: User = new User();
  public updateUser: User = new User();
  private subscriptions: Subscription[];
  private jwtService: JwtHelperService;

  constructor(private router: Router, private authService: AuthService,
              private userService: UserService, private notificationService: NotificationService) {
    this.users = this.fetchUsers();
    this.subscriptions = [];
    this.jwtService = new JwtHelperService();
    this.username = this.obtainSubjectFromToken();
  }

  private obtainSubjectFromToken(): string {
    const token: string = this.authService.getToken();
    return this.jwtService.decodeToken(token).sub;
  }

  ngOnInit(): void {
    this.authService.loadToken();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public isOwner(): boolean {
    const token: string = this.authService.getToken();
    let jwtData = token.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData.Authorities.find((auth: string) => auth === AuthoritiesEnum.DELETE.toString());
  }

  public isAdmin(): boolean {
    const token: string = this.authService.getToken();
    let jwtData = token.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData.Authorities.find((auth: string) => auth === AuthoritiesEnum.UPDATE.toString());
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    // @ts-ignore
    document.getElementById('openUserInfo').click();
  }

  public onDelete(username: string): void {
    const subscription: Subscription = this.userService.deleteUserByUsername(username).subscribe({
      next: () => {
        this.notificationService.notify(NotificationTypeEnum.SUCCESS, `User with username ${username} successfully deleted!`);
        window.location.reload();
      }, error: () => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, 'There was a problem executing that request!');
      }
    });

    this.subscriptions.push(subscription);
  }

  public onUpdate(user: User): void {
    this.updateUser = user;
    // @ts-ignore
    document.getElementById('openUserEdit').click();
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
