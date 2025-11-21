import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
  this.adminService.getProducts().subscribe({
    next: (data) => {
      this.products = data.map(p => ({
        ...p,
        // If images field exists as JSON array, take the first element
        image: p.images ? (Array.isArray(p.images) ? p.images[0] : p.images) : ''
      }));
    },
    error: (err) => console.error(err)
  });
}


  openProduct(id: number) {
    this.router.navigate(['/product', id]);
  }
}
