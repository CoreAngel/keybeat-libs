import { Subject } from 'rxjs';

export default class TokenService {
  private token: string | null = null;
  private subject = new Subject();

  public setToken = (token: string) => {
    this.token = token;
    this.subject.next(token);
  };

  public clearToken = () => {
    this.token = null;
    this.subject.next(null);
  };

  public getToken = () => {
    return this.token;
  };

  public getObservable = () => this.subject.asObservable();
}
