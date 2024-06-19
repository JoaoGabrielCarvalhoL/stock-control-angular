import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private formBuilder: FormBuilder) { }

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
    alert(this.signUpForm.value)
  }
}
