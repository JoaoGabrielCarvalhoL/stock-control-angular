import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../../services/category/category.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoryResponse } from '../../../../models/interfaces/category/response/GetCategoryResponse';
import { CreateProductRequest } from '../../../../models/interfaces/product/request/CreateProductRequest';
import { ProductService } from '../../../../services/product/product.service';
import { EditProductRequest } from '../../../../models/interfaces/product/request/EditProductRequest';
import { EventAction } from '../../../../models/interfaces/product/event/EventAction';
import { GetAllProductsResponse } from '../../../../models/interfaces/product/response/GetAllProductsResponse';
import { ProductDataTransferService } from '../../../../shared/services/products/product-data-transfer.service';
import { ProductEvent } from '../../../../models/enums/products/ProductEvent';
import { SaleProductRequest } from '../../../../models/interfaces/product/request/SaleProductRequest';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public categories: Array<GetCategoryResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {
    event: EventAction;
    productData: Array<GetAllProductsResponse>;
  };
  public productSelectedData!: GetAllProductsResponse;
  public productDatas!: Array<GetAllProductsResponse>;
  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private productService: ProductService,
    public ref: DynamicDialogConfig,
    private productsDataTransferService: ProductDataTransferService) {}

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    productId: ["", Validators.required]
  })

  public addProductAction: ProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction: ProductEvent = ProductEvent.UPDATE_PRODUCT_EVENT;
  public saleProductAction: ProductEvent = ProductEvent.SALE_PRODUCT_EVENT;

  public saleProductSelected!: GetAllProductsResponse;

  ngOnInit(): void {
    this.productAction = this.ref.data;

    if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productData) {
      this.getProductSelectedData(this.productAction?.event?.id as string)
    }

    if (this.productAction?.event.action === this.saleProductAction) {
      this.getProductDatas();
    }

    this.getAllCategories();

  }

  getAllCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.categories = response;
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching categories',
            life: 2500,
          });
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.categoryId as string,
        amount: Number(this.addProductForm.value.amount),
      };
      this.productService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product saved!',
                life: 2500,
              });
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error to save a new product.',
              life: 2500,
            });
          },
        });
      this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void {
    if (this.editProductForm?.value && this.editProductForm.valid && this.productAction.event.id) {
      const requestEditProduct: EditProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        product_id: this.productAction?.event?.id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productService.updateProduct(requestEditProduct).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Product updated successfully!",
            life: 2500
          });
          this.editProductForm.reset();
        },
        error: error => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed on update product!",
            life: 2500
          });
          this.editProductForm.reset();
        }
      })

    }
  }

  getProductSelectedData(productId: string): void {
    const allProducts = this.productAction?.productData;
    if (allProducts) {
      const productFiltered = allProducts.filter(element => element?.id === productId);
      if (productFiltered) {
        this.productSelectedData = productFiltered[0];
        this.editProductForm.setValue({
          name: this.productSelectedData?.name,
          price: this.productSelectedData?.price,
          description: this.productSelectedData?.description,
          amount: this.productSelectedData?.amount

        });
      }
    }
  }

  getProductDatas(): void {
    this.productService.getAllProducts().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response) {
            this.productDatas = response;
            if (this.productDatas) this.productsDataTransferService.setProductsDatas(this.productDatas);
          }
        },
        error: error => {
          console.log(error);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.valid && this.saleProductForm?.value) {
      const request: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        productId: this.saleProductForm.value?.productId as string
      };

      this.productService.saleProduct(request).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            if (response) {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Sale finished successfully!",
                life: 2500
              });
              this.saleProductForm.reset();
              this.getProductDatas();
              this.router.navigate(["/dashboard"]);
            }
          },
          error: error => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to finishe sale!",
              life: 2500
            });
          }
        })
    }
  }

}
