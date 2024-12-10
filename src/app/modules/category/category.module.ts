import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryHomeComponent } from './page/category-home/category-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CATEGORY_ROUTES } from './category.routing';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';



@NgModule({
  declarations: [
    CategoryHomeComponent,
    CategoryTableComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(CATEGORY_ROUTES), SharedModule, HttpClientModule,
    CardModule, ButtonModule, TableModule, InputMaskModule, InputSwitchModule, InputTextModule, InputTextareaModule, InputNumberModule, DynamicDialogModule, DropdownModule, ConfirmDialogModule, TooltipModule
  ],
  providers: [DialogService, ConfirmationService]
})
export class CategoryModule { }
