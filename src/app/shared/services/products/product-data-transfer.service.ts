import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from '../../../models/interfaces/product/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductDataTransferService {

  constructor() { }

  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null> (null);
  public productsData: Array<GetAllProductsResponse> = [];

  public setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsDatas();
    }
  }

  public getProductsDatas(): Array<GetAllProductsResponse> {
    this.productsDataEmitter$.pipe(take(1), map(data => data?.filter(p => p.amount > 0))).subscribe({
      next: response => {
        if(response) this.productsData = response;
      }
    });
    return this.productsData;
  }
}
