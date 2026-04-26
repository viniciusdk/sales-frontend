import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../../shared/models/user.model';

const TOKEN_KEY = 'valdete_token';
const USER_KEY  = 'valdete_user';

const MOCK_USER: User = {
  id: '1',
  name: 'Administrador',
  email: 'admin@valdetmodas.com.br',
  role: 'admin',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.loadUser());
  readonly currentUser = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<LoginResponse> {
    const mock: LoginResponse = { user: MOCK_USER, token: 'mock-jwt-token-' + Date.now() };
    return of(mock).pipe(
      delay(800),
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._user.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
