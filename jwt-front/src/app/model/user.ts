export class User {
  public id!: number;
  public userId!: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public lastLoginDateDisplay!: Date;
  public lastLoginDate!: Date;
  public joinDate!: Date;
  public profileImageUrl!: string;
  public isActive: boolean;
  public isNonLocked: boolean;
  public role: string;
  public authorities: [];


  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.isActive = false;
    this.isNonLocked = false;
    this.role = '';
    this.authorities = [];
  }
}
