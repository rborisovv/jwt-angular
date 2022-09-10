import {Component, Input, OnInit} from '@angular/core';
import {faCogs, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() public username: string = '';
  @Input() public pageTitle: string = '';
  public navWidth!: string;

  faUsers = faUsers;
  faUser = faUser;
  faCogs = faCogs;

  constructor() {
  }

  ngOnInit(): void {
    if (this.pageTitle === 'Users') {
      this.navWidth = 'width: 100% !important;';
    }
  }

}
