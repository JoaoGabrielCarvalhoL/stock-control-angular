import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetCategoryResponse } from '../../../../models/interfaces/category/response/GetCategoryResponse';
import { EditCategoryAction } from '../../../../models/interfaces/category/event/EditCategoryAction';
import { CategoryEvent } from '../../../../models/enums/categories/CategoryEvent';
import { DeleteCategoryAction } from '../../../../models/interfaces/category/event/DeleteCategoryAction';


@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  @Input() public categories: Array<GetCategoryResponse> = [];
  @Output() public categoryEvent: EventEmitter<EditCategoryAction> = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent: EventEmitter<DeleteCategoryAction> = new EventEmitter<DeleteCategoryAction>;
  public categorySelected!: GetCategoryResponse;
  public addCategoryAction: CategoryEvent = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction: CategoryEvent = CategoryEvent.EDIT_CATEGORY_ACTION;

  handleDeleteCategoryEvent(categoryId: string, categoryName: string): void {
    if (categoryId !== "" && categoryName !== "") {
      this.deleteCategoryEvent.emit({ categoryId, categoryName })
    }
  }

  handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== "") {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }


}
