import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumExplorerComponent} from './components/forum-explorer/forum-explorer.component';

const routes: Routes = [
  {path: '', component: ForumExplorerComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ForumExplorerRoutingModule {
}
