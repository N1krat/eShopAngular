import { TestBed } from '@angular/core/testing';

import { ProductsLoad } from './products-load';

describe('ProductsLoad', () => {
  let service: ProductsLoad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsLoad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
