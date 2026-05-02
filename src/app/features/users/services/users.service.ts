import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';

export interface UserForm {
  name: string;
  email: string;
  role: 'admin' | 'seller';
  active: boolean;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getAll(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.base);
  }

  create(form: UserForm): Observable<AppUser> {
    return this.http.post<AppUser>(this.base, form);
  }

  update(id: string, form: UserForm): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.base}/${id}`, form);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
