import {Component, Input, OnInit} from '@angular/core';
import {faCogs, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() username: string = '';
  @Input() navStyle: string = '';

  faUsers = faUsers;
  faUser = faUser;
  faCogs = faCogs;

  constructor() {
  }

  ngOnInit(): void {
  }

}
