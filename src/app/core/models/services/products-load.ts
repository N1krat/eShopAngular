import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ItemsService {
  private items: Product[] = [];
  private readonly url = 'assets/date.json';

  constructor(private http: HttpClient) {}

  // încarcă datele din fișierul JSON o singură dată
  load(): Observable<Product[]> {
    if (this.items.length > 0) {
      return of(this.items); // deja încărcate
    }
    return this.http.get<Product[]>(this.url).pipe(
      tap(data => this.items = data)
    );
  }

  getItems(): Product[] {
    return this.items;
  }
}
