import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(savedUser);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin123') {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(username);
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}