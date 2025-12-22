import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    // Check if user was logged in before (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(savedUser);
    }
  }

  // Observable for components to subscribe to
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Get current authentication status
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Get current user
  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  // Simple login (for demo purposes - no real backend)
  login(username: string, password: string): boolean {
    // Demo credentials - in real app, this would call an API
    if (username === 'admin' && password === 'admin123') {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(username);
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}