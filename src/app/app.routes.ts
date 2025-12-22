import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductDetails } from './components/product-details/product-details';
import { Cart } from './components/cart/cart';
import { Admin } from './components/admin/admin';
import { Login } from './components/login/login';
import { NotFound } from './components/not-found/not-found';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'product/:id', component: ProductDetails },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
  { path: '**', component: NotFound }
];