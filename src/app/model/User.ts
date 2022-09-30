export class User {
  uid?: string;
  email?: string;
  displayName?: string;
  emailVerified?: boolean;

  constructor(json: User = {}) {
    this.uid = json.uid ? json.uid : '';
    this.email = json.email ? json.email : '';
    this.displayName = json.displayName ? json.displayName : '';
    this.emailVerified = json.emailVerified !== undefined ? json.emailVerified : false;
  }
}
