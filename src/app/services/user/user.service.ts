import { SignUpRequest } from './../../models/interfaces/user/SignUpRequest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SignUpResponse } from '../../models/interfaces/user/SignUpResponse';
import { SignInResponse } from '../../models/interfaces/user/SignInResponse';
import { SignInRequest } from '../../models/interfaces/user/SignInRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL: string = environment.API_URL;
  constructor(private httpClient: HttpClient) { }

  public signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.httpClient.post<SignUpResponse>(
      `${this.BASE_URL}/user`,
      signUpRequest
    );
  }

  public authenticate(signInRequest: SignInRequest): Observable<SignInResponse> {
    return this.httpClient.post<SignInResponse>(
      `${this.BASE_URL}/auth`,
      signInRequest
    );
  }
}
