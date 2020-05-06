export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: string,
    public firstName: string,
    public lastName: string,
  ) {}
}
