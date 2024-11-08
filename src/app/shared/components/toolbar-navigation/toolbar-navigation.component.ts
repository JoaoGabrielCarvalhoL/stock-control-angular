import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrl: './toolbar-navigation.component.scss'
})
export class ToolbarNavigationComponent {
  constructor(private cookieService: CookieService, private router: Router) {}

  public handleLogout(): void {
    this.cookieService.delete("USER_TOKEN");
    this.router.navigate(["/home"]);
  }
}
