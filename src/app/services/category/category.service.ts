import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { GetCategoryResponse } from '../../models/interfaces/category/response/GetCategoryResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get("USER_TOKEN");

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.JWT_TOKEN}`
    })
  }

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getAllCategories(): Observable<Array<GetCategoryResponse>> {
    return this.httpClient.get<Array<GetCategoryResponse>>(
      `${this.API_URL}/categories`, this.httpOptions
    );

  }
}
