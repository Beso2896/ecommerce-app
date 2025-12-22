import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  productForm!: FormGroup;
  submitted: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  currentUser: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Initialize form with validation
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.productForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    const productData = {
      ...this.productForm.value,
      price: parseFloat(this.productForm.value.price),
      rating: {
        rate: 0,
        count: 0
      }
    };

    // Call API to add product
    this.productService.addProduct(productData).subscribe({
      next: (response) => {
        this.successMessage = 'Product added successfully!';
        console.log('Product added:', response);
        
        // Reset form after 2 seconds
        setTimeout(() => {
          this.resetForm();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product. Please try again.';
        console.error('Error adding product:', err);
      }
    });
  }

  resetForm(): void {
    this.productForm.reset();
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}