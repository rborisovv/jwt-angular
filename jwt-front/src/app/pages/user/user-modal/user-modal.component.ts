import {Component, Input, OnInit} from '@angular/core';
import {faEnvelope, faIdBadge, faLock, faShieldAlt, faUnlock, faUserSecret} from '@fortawesome/free-solid-svg-icons';
import {User} from "../../../model/user";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  faIdBadge = faIdBadge;
  faEnvelope = faEnvelope;
  faShieldAlt = faShieldAlt;
  faUserSecret = faUserSecret;
  faLock = faLock;
  faUnlock = faUnlock;

  @Input() selectedUser: User = new User();

  constructor() {

  }

  ngOnInit(): void {
  }

}
