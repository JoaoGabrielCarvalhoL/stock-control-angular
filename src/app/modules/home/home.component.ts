import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SignUpRequest } from '../../models/interfaces/user/SignUpRequest';
import { SignInRequest } from '../../models/interfaces/user/SignInRequest';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService) { }

  loginCard: boolean = true

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  public onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authenticate(this.loginForm.value as SignInRequest).subscribe( {
        next: (response) => {
          if (response) {
            this.cookieService.set("USER_TOKEN", response?.token);
            this.loginForm.reset();
          }
        },
        error: (error) => console.error(error)
      })
    }
  }

  public onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUp(this.signUpForm.value as SignUpRequest).subscribe({
        next: (response) => {
          if (response) {
            alert("Usuário criado com sucesso!");
            this.signUpForm.reset();
            this.loginCard = true;
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }
}
