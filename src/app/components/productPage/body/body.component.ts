import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './body.html',
  styleUrls: ['./body.css']
})
export class BodyComponent implements OnInit {
  product?: Product;

  constructor(private route: ActivatedRoute, private adminService: AdminService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.adminService.getProductById(id).subscribe({
      next: (data) => {
        // Ensure images is always an array
        this.product = {
          ...data,
          images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : [])
        };
      },
      error: (err) => console.error(err)
    });
  }

  // Helper to get full URL for backend images
  getImageUrl(imgPath?: string): string {
    return imgPath ? `http://localhost:3000${imgPath}` : 'assets/no-image.png';
  }

  addToCart(product: Product) {
    console.log('Add to cart clicked', product);
    // implement cart logic here
  }
}
