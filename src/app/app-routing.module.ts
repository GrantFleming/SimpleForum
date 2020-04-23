import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumComponent} from './forum/components/forum/forum.component';


const routes: Routes = [
  {path: '', redirectTo: 'forums/1', pathMatch: 'full'}, // temporary redirection
  {path: 'forums/:id', component: ForumComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
