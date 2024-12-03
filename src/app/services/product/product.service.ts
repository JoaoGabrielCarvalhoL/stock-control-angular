import { CreateProductRequest } from './../../models/interfaces/product/request/CreateProductRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { GetAllProductsResponse } from '../../models/interfaces/product/response/GetAllProductsResponse';
import { DeleteProductResponse } from '../../models/interfaces/product/response/DeleteProductResponse';
import { CreateProductResponse } from '../../models/interfaces/product/response/CreateProductResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get("USER_TOKEN");
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.JWT_TOKEN}`
    })
  }

  public getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.httpClient.get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`, this.httpOptions)
    .pipe(map(product => product.filter(p => p.amount > 0 )));
  }

  public deleteProduct(productId: string): Observable<DeleteProductResponse> {
    return this.httpClient.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`,
      {
        ...this.httpOptions,
        params: {
          product_id: productId
        }
      }
    );
  }

  createProduct(product: CreateProductRequest): Observable<CreateProductResponse> {
      return this.httpClient.post<CreateProductResponse>(`${this.API_URL}/product`, product, this.httpOptions);
  }
}
