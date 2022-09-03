export class User {
  public id!: number;
  public userId!: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public loginDateDisplay!: Date;
  public joinDate!: Date;
  public profileImageUrl!: string;
  public active: boolean;
  public nonLocked: boolean;
  public role: string;
  public authorities: [];


  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.active = false;
    this.nonLocked = false;
    this.role = '';
    this.authorities = [];
  }
}
