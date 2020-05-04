import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumComponent} from './forum/components/forum/forum.component';
import {ForumExplorerComponent} from './forum-explorer/components/forum-explorer/forum-explorer.component';
import {Error404Component} from './error-pages/error404/error404.component';


const routes: Routes = [
  {path: '', redirectTo: 'forums', pathMatch: 'full'},
  {path: 'forums/:id', component: ForumComponent},
  {path: 'forums', component: ForumExplorerComponent},
  {path: 'page-not-found', component: Error404Component},
  {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
