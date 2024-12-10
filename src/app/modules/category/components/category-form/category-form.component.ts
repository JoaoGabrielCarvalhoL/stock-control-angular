import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../../services/category/category.service';
import { CategoryEvent } from '../../../../models/enums/categories/CategoryEvent';
import { EditCategoryAction } from '../../../../models/interfaces/category/event/EditCategoryAction';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit, OnDestroy{

  private readonly destroy$: Subject<void> = new Subject<void>();
  public addCategoryAction: CategoryEvent = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction: CategoryEvent = CategoryEvent.EDIT_CATEGORY_ACTION;
  public categoryAction!: { event: EditCategoryAction };


  constructor(public ref: DynamicDialogConfig, private formBuilder: FormBuilder,
    private messageService: MessageService, private categoryService: CategoryService
  ) {}

  public categoryForm = this.formBuilder.group({
    name: ["", Validators.required]
  });

  ngOnInit(): void {
    this.categoryAction = this.ref.data;
    if (this.categoryAction?.event?.action === this.editCategoryAction && this.categoryAction?.event?.categoryName !== null || undefined) {
      this.setCategoryName(this.categoryAction?.event?.categoryName as string);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const request: { name: string } = {
        name: this.categoryForm.value.name as string
      };
      this.categoryService.createNewCategory(request).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response) {
            this.categoryForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Category saved successfully.",
              life: 2500
            });
          }
        },
        error: error => {
          console.log(error);
          this.categoryForm.reset();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save a new category.",
            life: 2500
          });
        }
      });
    }
  }

  handleSubmitCategoryAction(): void {
    if (this.categoryAction?.event?.action === this.addCategoryAction) {
      this.handleSubmitAddCategory();
    } else if (this.categoryAction?.event?.action === this.editCategoryAction) {
      this.handleSubmitEditCategory();
    }
  }

  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName
      })
    }
  }

  handleSubmitEditCategory(): void {
    if (this.categoryForm?.valid && this.categoryForm?.value && this.categoryAction?.event?.id) {
      const request: { name: string; category_id: string} = {
        name: this.categoryForm.value.name as string,
        category_id: this.categoryAction.event.id
      }
      this.categoryService.editCategory(request).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Category updated successfully",
              life: 2500
            });
          },
          error: error => {
            console.log(error);
            this.categoryForm.reset();
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to update category",
              life: 2500
            });
          }
        });
        this.categoryService.getAllCategories();
    }
  }

}
