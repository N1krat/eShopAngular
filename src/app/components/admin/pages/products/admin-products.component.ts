import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { Product } from '../../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class AdminProducts implements OnInit {

  products: Product[] = [];

  newProduct: Partial<Product> & { imageFiles?: File[] } = {
    name: '',
    description: '',
    stock: 0,
    price: 0,
    image: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (data: Product[]) => {
        // Ensure 'images' is always an array for *ngFor
        this.products = data.map(p => ({
          ...p,
          images: Array.isArray(p.image) ? p.images : (p.image ? [p.image] : [])
        }));
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length) {
      this.newProduct.imageFiles = Array.from(files);
    }
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;

    const formData = new FormData();
    formData.append('name', this.newProduct.name!);
    formData.append('description', this.newProduct.description || '');
    formData.append('stock', (this.newProduct.stock || 0).toString());
    formData.append('price', (this.newProduct.price || 0).toString());

    // Append multiple images
    if (this.newProduct.imageFiles) {
      this.newProduct.imageFiles.forEach(file => formData.append('images', file));
    }

    this.adminService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.loadProducts();

        // Close modal
        const modal = document.getElementById('addProductModal');
        if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();

        // Reset form
        this.newProduct = { name: '', description: '', stock: 0, price: 0, image: '' };
        this.newProduct.imageFiles = [];
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }
}
