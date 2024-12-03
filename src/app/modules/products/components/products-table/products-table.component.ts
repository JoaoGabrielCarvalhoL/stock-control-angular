import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetAllProductsResponse } from '../../../../models/interfaces/product/response/GetAllProductsResponse';
import { ProductEvent } from '../../../../models/enums/products/ProductEvent';
import { EventAction } from '../../../../models/interfaces/product/event/EventAction';
import { DeleteProductAction } from '../../../../models/interfaces/product/event/DeleteProductAction';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!:GetAllProductsResponse;

  public addProductEvent:ProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public updateProductEvent:ProductEvent = ProductEvent.UPDATE_PRODUCT_EVENT;
  public saleProductEvent:ProductEvent = ProductEvent.SALE_PRODUCT_EVENT;
  public deleteProductEvent:ProductEvent = ProductEvent.DELETE_PRODUCT_EVENT;

  public handleProductEvent(action: string, id?: string): void {
    if (action && action !== "") {
      const productEventData = id && id !== "" ? {action, id} : {action};
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(productId: string, productName: string): void {
    if (productId !== "" && productName !== "") {
      this.deleteEvent.emit({
        productId, productName
      });
    }
  }
}
