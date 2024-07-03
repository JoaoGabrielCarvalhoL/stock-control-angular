import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SignUpRequest } from '../../models/interfaces/user/SignUpRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private formBuilder: FormBuilder,
    private userService: UserService) { }

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
    alert(this.loginForm.value)
  }

  public onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUp(this.signUpForm.value as SignUpRequest).subscribe({
        next: (response) => {
          if (response) {
            alert("Usuário criado com sucesso!")
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }
}
