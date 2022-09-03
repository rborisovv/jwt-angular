import { Component, OnInit } from '@angular/core';
import {faIdCard, faUser, faEnvelope, faSpinner} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  faUser = faUser;
  faIdCard = faIdCard;
  faEnvelope = faEnvelope;
  faSpin = faSpinner;

  constructor() { }

  ngOnInit(): void {
  }

}
