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
import {RoleEnum} from "../../enum/role.enum";

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
  public pageTitle: string;
  public selectedUser: User;
  public loggedUser: User;
  public updateUser: User;
  public addUser: User = new User();
  private subscriptions: Subscription[];
  private jwtService: JwtHelperService;

  constructor(private router: Router, private authService: AuthService,
              private userService: UserService, private notificationService: NotificationService) {

    this.subscriptions = [];
    this.users = this.fetchUsers();
    this.selectedUser = new User();
    this.pageTitle = 'Users';
    this.loggedUser = this.authService.getUserFromLocalCache();
    this.username = this.loggedUser.username;
    this.updateUser = new User();
    this.jwtService = new JwtHelperService();
  }

  ngOnInit(): void {
    this.authService.loadToken();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public isOwner(): boolean {
    return this.loggedUser.role === RoleEnum.OWNER.toString();
  }

  public canUpdate(): boolean {
    return this.loggedUser.role === RoleEnum.OWNER.toString()
      || this.loggedUser.role === RoleEnum.ADMIN.toString()
      || this.loggedUser.role === RoleEnum.HR
      || this.loggedUser.role === RoleEnum.MANAGER;
  }

  public canCreate(): boolean {
    return this.loggedUser.role === RoleEnum.OWNER.toString()
      || this.loggedUser.role === RoleEnum.ADMIN.toString()
      || this.loggedUser.role === RoleEnum.HR;
  }

  public isAdmin(): boolean {
    return this.loggedUser.role === RoleEnum.ADMIN.toString();
  }

  public isCurrentlyLoggedUser(username: string): boolean {
    return this.loggedUser.username === username;
  }

  public onSelectUser(selectedUser: User): void {

    const subscription: Subscription = this.userService.getUser(selectedUser.username).subscribe({
      next: response => {
        this.selectedUser = response;
        // @ts-ignore
        document.getElementById('openUserInfo').click();
      },
      error: errResponse => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, errResponse.error.message);
      }
    });

    this.subscriptions.push(subscription);
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
    const subscription: Subscription = this.userService.getUsers().subscribe({
      next: response => {
        response.forEach(user => users.push(user));
      },
      error: errorResponse => {
        this.notificationService.notify(NotificationTypeEnum.ERROR, errorResponse.error.message);
      }
    });

    this.subscriptions.push(subscription);

    return users;
  }

  public onAddUserClick(): void {
    // @ts-ignore
    document.getElementById('addUserBtn').click();
  }

  public fetchUpdatedUsers(users: User[]): void {
    this.users = [];
    this.users = users;
  }
}
