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
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ---------------- USERS CRUD ----------------

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  addUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, data: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data);
  }

  removeUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // ---------------- PRODUCTS CRUD ----------------

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/api/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/api/products/${id}`);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/products`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/products/${id}`, formData);
  }

  removeProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/products/${id}`);
  }

  // ---------------- ORDERS CRUD ----------------

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  addOrder(order: Partial<Order>): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  updateOrder(id: number, data: Partial<Order>): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}`, data);
  }

  removeOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }
}
