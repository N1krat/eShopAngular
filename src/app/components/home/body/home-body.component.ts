import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './body.html',
  styleUrls: ['./body.css']
})
export class BodyComponent implements OnInit {
  products: Product[] = [];

  offerImage: string = '/uploads/Desktop-1045x480-RO.jpg';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => ({
          ...p,
          image: p.images && p.images.length > 0 ? p.images[0] : null
        }));
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }
}
