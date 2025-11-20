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

  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    stock: 0,
    price: 0,
    image: ''
  };

  selectedFile: File | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (data: Product[]) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;

    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('stock', this.newProduct.stock.toString());
    formData.append('price', this.newProduct.price.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.loadProducts();
        // Close the modal manually
        const modal = document.getElementById('addProductModal');
        if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
        // Reset form
        this.newProduct = { id: 0, name: '', description: '', stock: 0, price: 0, image: '' };
        this.selectedFile = null;
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }
}
