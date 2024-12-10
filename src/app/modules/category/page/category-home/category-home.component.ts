import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category/category.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoryResponse } from '../../../../models/interfaces/category/response/GetCategoryResponse';
import { DeleteCategoryAction } from '../../../../models/interfaces/category/event/DeleteCategoryAction';
import { EventAction } from '../../../../models/interfaces/product/event/EventAction';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.scss'
})
export class CategoryHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public categories: Array<GetCategoryResponse> = [];
  private ref!: DynamicDialogRef;

  constructor(private categoryService: CategoryService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) {}

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }



  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().pipe(takeUntil(this.destroy$))
    .subscribe({
      next: response => {
        if (response) {
          this.categories = response;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Fecthing categories successfully!",
            life: 2500
          });
        }
      },
      error: error => {
        console.log(error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to retrieve categories!",
          life: 2500
        });
        this.router.navigate(['/dashboard']);
      }
    })
  }

  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Do you really want to delete product ${event.categoryName}?`,
        header: "Confirmation of exclusion",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Yes",
        rejectLabel: "No",
        accept: () => {
          this.deleteCategory(event?.categoryId);
        }
      })
    }
  }
  deleteCategory(category_id: string) {
    if (category_id) {
      this.categoryService.deleteCategory({ category_id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.getAllCategories();
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Category deleted successfully",
            life: 2500
          });

        },
        error: error => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete category!",
            life: 2500
          });
        }
      });
    }
  }

  handleCategoryAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(CategoryFormComponent, {
        header: event?.action,
        width: "70%",
        contentStyle: {
          overflow: "auto"
        },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event
        }
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.getAllCategories();
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

}
