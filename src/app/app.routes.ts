import { Routes } from '@angular/router';
import { HomeConnectorComponent } from './components/home/home-connector/home-connector.component';
import { ProductConnectorComponent } from './components/products/product-connector/product-conector.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeConnectorComponent }, 
  { path: 'products', component: ProductConnectorComponent } 
];
