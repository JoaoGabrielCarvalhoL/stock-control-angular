import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [{
  path: "",
  redirectTo: "dashboard",
  pathMatch: "full"
},
{
  path: "home",
  component: HomeComponent
},
{
  path: "dashboard",
  loadChildren: () => import("./modules/dashboard/dashboard.module")
  .then( module => module.DashboardModule),
  canActivate: [AuthGuardService]
},
{
  path: "products",
  loadChildren: () => import("./modules/products/products.module")
  .then(module => module.ProductsModule),
  canActivate: [AuthGuardService]
},
{
  path: "categories",
  loadChildren: () => import("./modules/category/category.module")
  .then(module => module.CategoryModule),
  canActivate: [AuthGuardService]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
