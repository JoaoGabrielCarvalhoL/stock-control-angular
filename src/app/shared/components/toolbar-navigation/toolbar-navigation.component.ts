import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../../modules/products/components/product-form/product-form.component';
import { ProductEvent } from '../../../models/enums/products/ProductEvent';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrl: './toolbar-navigation.component.scss'
})
export class ToolbarNavigationComponent {
  constructor(private cookieService: CookieService,
    private router: Router, private dialogService: DialogService) {}

  public handleLogout(): void {
    this.cookieService.delete("USER_TOKEN");
    this.router.navigate(["/home"]);
  }

  public handleSaleProduct(): void {
    this.dialogService.open(ProductFormComponent, {
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: "70%",
      contentStyle: {
        overflow: "auto"
      },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: {
          action: ProductEvent.SALE_PRODUCT_EVENT
        }
      }
    })
  }
}
