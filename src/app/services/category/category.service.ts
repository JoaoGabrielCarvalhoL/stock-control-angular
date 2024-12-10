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

  deleteCategory(request: { category_id: string }): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: {
        category_id: request.category_id
      }
    });
  }

  createNewCategory(category: { name: string; }): Observable<Array<GetCategoryResponse>> {
    return this.httpClient.post<Array<GetCategoryResponse>>(`${this.API_URL}/category`, category, this.httpOptions);
  }

  editCategory(category: { name: string; category_id: string }): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/category/edit`, {
      name: category?.name
    }, {
      ...this.httpOptions,
      params: {
        category_id: category?.category_id
      }
    });
  }

}
