import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ItemsService } from '../../../core/models/services/products-load';
import { Product } from '../../../core/models/model';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body.html',
  styleUrls: ['./body.css']
})
export class BodyComponent implements OnInit {
  product?: Product;

  constructor(private route: ActivatedRoute, private itemsService: ItemsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemsService.load().subscribe({
      next: (data) => {
        this.product = data.find((p) => p.id === id);
      },
      error: (err) => console.error('Eroare la încărcare produs:', err)
    });
  }
}
