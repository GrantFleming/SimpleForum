import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumComponent} from './forum/components/forum/forum.component';
import {ForumExplorerComponent} from './forum-explorer/components/forum-explorer/forum-explorer.component';


const routes: Routes = [
  {path: '', redirectTo: 'forums', pathMatch: 'full'},
  {path: 'forums/:id', component: ForumComponent},
  {path: 'forums', component: ForumExplorerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
