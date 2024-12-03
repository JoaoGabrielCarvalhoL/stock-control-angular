import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../services/product/product.service';
import { ProductDataTransferService } from '../../../../shared/services/products/product-data-transfer.service';

import { GetAllProductsResponse } from '../../../../models/interfaces/product/response/GetAllProductsResponse';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from '../../../../models/interfaces/product/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.scss'
})
export class ProductsHomeComponent implements OnDestroy, OnInit{

  private readonly destroy$: Subject<void> = new Subject();
  public productsData: Array<GetAllProductsResponse> = [];
  private ref!: DynamicDialogRef;

  constructor(
    private productService: ProductService,
    private productsDataTransferService: ProductDataTransferService,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService) {

    }
  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData(): void {
    const productsLoaded: Array<GetAllProductsResponse> = this.productsDataTransferService.getProductsDatas();
    if (productsLoaded.length > 0) {
      this.productsData = productsLoaded;
    } else {
      this.getAPIProductsData();
    }
  }

  getAPIProductsData(): void {
    this.productService.getAllProducts().pipe(takeUntil(this.destroy$))
    .subscribe({
      next: response => {
        if (response) {
          this.productsData = response;
        }
      },
      error: err => {
        console.error(err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error to retrieve products.",
          life: 2500
        });
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: "70%",
        contentStyle: {
          overflow: "auto"
        },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productData: this.productsData
        }
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIProductsData()
      })
    }
  }

  handleDeleteProductAction(event: {productId: string, productName: string}): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Do you really want to delete the product ${event?.productName} ?`,
        header: "Confirmation of delete",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Yes",
        rejectLabel: "No",
        accept: () => {
          this.deleteProduct(event?.productId)
        }
      })
    }
  }

  deleteProduct(productId: string): void {
    if(productId) {
      this.productService.deleteProduct(productId)
      .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response) {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Product deleted successfully",
                life: 2500
              });

              this.getAPIProductsData();
            }
          },
          error: error => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error deleting product",
              life: 2500
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
