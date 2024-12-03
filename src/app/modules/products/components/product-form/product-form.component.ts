import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../../services/category/category.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoryResponse } from '../../../../models/interfaces/category/response/GetCategoryResponse';
import { CreateProductRequest } from '../../../../models/interfaces/product/request/CreateProductRequest';
import { ProductService } from '../../../../services/product/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy{

  private readonly destroy$ = new Subject<void>();
  public categories: Array<GetCategoryResponse> = [];
  public selectedCategory: Array<{ name:string; code:string; }> = [];

  constructor(private categoryService: CategoryService, private formBuilder:FormBuilder,
    private messageService: MessageService, private router: Router, private productService: ProductService) {}

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    amount: [0, Validators.required]
  });

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: response => {
        if(response) {
          this.categories = response;
        }
      },
      error: error => {
        console.log(error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error fetching categories",
          life: 2500
        });
      }
    });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.categoryId as string,
        amount: Number(this.addProductForm.value.amount)
      };
      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Product saved!",
              life: 2500
            })
          }
        },
        error: error => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error to save a new product.",
            life: 2500
          });

        }
      });
      this.addProductForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
