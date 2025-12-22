import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  // Get cart items as observable
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Add product to cart
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    
    this.updateCart();
  }

  // Remove product from cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  // Update quantity
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Get total items count
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.product.id === productId);
  }

  // Private method to update cart and save to localStorage
  private updateCart(): void {
    this.cartSubject.next(this.cartItems);
    this.saveCartToStorage();
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }
}