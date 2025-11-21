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

  newProduct: Partial<Product> & { imageFile?: File } = {
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
          images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : [])
        }));
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.newProduct.imageFile = file;
    }
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;

    const formData = new FormData();
    formData.append('name', this.newProduct.name!);
    formData.append('description', this.newProduct.description || '');
    formData.append('stock', (this.newProduct.stock || 0).toString());
    formData.append('price', (this.newProduct.price || 0).toString());

    if (this.newProduct.imageFile) {
      formData.append('image', this.newProduct.imageFile);
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
        this.newProduct.imageFile = undefined;
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }

  removeProduct(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    this.adminService.removeProduct(id).subscribe({
      next: () => {
        console.log('Product removed:', id);
        this.loadProducts(); // refresh list
      },
      error: (err) => console.error('Error deleting product:', err)
    });
  }
}
