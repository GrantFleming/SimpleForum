import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FrontendBackendTestComponent} from './frontend-backend-test/frontend-backend-test.component';


const routes: Routes = [
  {path: 'test', component: FrontendBackendTestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
