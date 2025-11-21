import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login';

  private loggedIn = new BehaviorSubject<boolean>(false); // initial false
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // verificăm doar dacă suntem în browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) this.loggedIn.next(true);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => this.saveToken(res.token))
    );
  }

  saveToken(token: string) {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('token', token);
      this.loggedIn.next(true);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      this.loggedIn.next(false);

      // redirect to login page
      this.router.navigate(['/login']);
    }
  }

  hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3000/auth/register', user);
  }
}
