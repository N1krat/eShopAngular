import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users.model';
import { Product } from '../models/product.model';
import { Order } from '../models/orders.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000'; // backend base URL

  constructor(private http: HttpClient) {}

  // ---------------- USERS ----------------
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  addUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  // ---------------- PRODUCTS ----------------
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/api/products`);
  }

  // Updated addProduct to accept FormData (for image upload)
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/products`, formData);
  }

  // ---------------- ORDERS ----------------
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }
}
