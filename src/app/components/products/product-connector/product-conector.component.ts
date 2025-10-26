import { Component } from '@angular/core';
import { HeaderComponent } from '../header/product-header.component';
import { BodyComponent } from '../body/product-body.component';
import { FooterComponent } from '../footer/product-footer.component';

@Component({
  selector: 'app-product-connector',
  template: `
    <app-header></app-header>
    <app-body></app-body>
    <app-footer></app-footer>
  `,
  standalone: true,  
  imports: [
    HeaderComponent,
    BodyComponent,
    FooterComponent
  ]
})
export class ProductConnectorComponent { }
