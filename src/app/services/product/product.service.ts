import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { GetAllProductsResponse } from '../../models/interfaces/product/response/GetAllProductsResponse';

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
}
