import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  currentUser: string | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });

    // Subscribe to authentication changes
    this.authService.isAuthenticated().subscribe(status => {
      this.isLoggedIn = status;
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}