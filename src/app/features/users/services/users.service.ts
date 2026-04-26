import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AppUser } from '../../../shared/models/user.model';

let MOCK_USERS: AppUser[] = [
  { id: '1', name: 'Valdete Alves',   email: 'admin@valdetmodas.com.br', role: 'admin',  active: true,  createdAt: '2026-01-10' },
  { id: '2', name: 'Carla Souza',     email: 'carla@valdetmodas.com.br',  role: 'seller', active: true,  createdAt: '2026-02-15' },
  { id: '3', name: 'Marcos Lima',     email: 'marcos@valdetmodas.com.br', role: 'seller', active: false, createdAt: '2026-03-01' },
  { id: '4', name: 'Ana Paula Costa', email: 'ana@valdetmodas.com.br',    role: 'seller', active: true,  createdAt: '2026-04-05' },
];

export interface UserForm {
  name: string;
  email: string;
  role: 'admin' | 'seller';
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  getAll(): Observable<AppUser[]> {
    return of([...MOCK_USERS]).pipe(delay(350));
  }

  create(form: UserForm): Observable<AppUser> {
    const user: AppUser = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    MOCK_USERS = [user, ...MOCK_USERS];
    return of(user).pipe(delay(500));
  }

  update(id: string, form: UserForm): Observable<AppUser> {
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    const updated: AppUser = { ...MOCK_USERS[idx], ...form };
    MOCK_USERS[idx] = updated;
    return of(updated).pipe(delay(500));
  }

  toggleActive(id: string): Observable<AppUser> {
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    MOCK_USERS[idx] = { ...MOCK_USERS[idx], active: !MOCK_USERS[idx].active };
    return of(MOCK_USERS[idx]).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
    return of(undefined).pipe(delay(400));
  }
}
