import { Routes } from '@angular/router';
import { HomeConnectorComponent } from './components/home/home-connector/home-connector.component';
import { ProductConnectorComponent } from './components/products/product-connector/product-conector.component';
import { ProductPageConnectorComponent } from './components/productPage/productPage-connector/productPage-connector.component';

// tipa admin page cu subpagine
import { AdminConnectorComponent } from './components/admin/admin-connector/admin-connector.component';
import { AdminProducts } from './components/admin/pages/products/admin-products.component';
import { AdminUsers } from './components/admin/pages/users/admin-users.component';
import { AdminOrders } from './components/admin/pages/orders/admin-orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeConnectorComponent },
  { path: 'products', component: ProductConnectorComponent },
  { path: 'product-page/:id', component: ProductPageConnectorComponent },
  {
    path: 'admin',
    component: AdminConnectorComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProducts },
      { path: 'users', component: AdminUsers },
      { path: 'orders', component: AdminOrders }
    ]
  }
];

