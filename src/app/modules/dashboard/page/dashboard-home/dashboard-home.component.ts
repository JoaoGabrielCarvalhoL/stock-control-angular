import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from '../../../../models/interfaces/product/response/GetAllProductsResponse';
import { ProductDataTransferService } from '../../../../shared/services/products/product-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private productsDataTransferService: ProductDataTransferService
  ) {}

  public products: Array<GetAllProductsResponse> = [];
  private destroy$ = new Subject<void>();
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  public getProducts(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.products = response;
            this.productsDataTransferService.setProductsDatas(this.products);
            this.setProductsCharConfig();
          }
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error to fetch Products from API',
            life: 2500,
          });
        },
      });
  }

  public setProductsCharConfig(): void {
    if (this.products.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.productsChartDatas = {
        labels: this.products.map((element) => element?.name),
        datasets: [
          {
            label: 'Amount',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor:
              documentStyle.getPropertyValue('--indigo-500'),
            data: this.products.map((element) => element?.amount),
          },
        ],
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }
}
