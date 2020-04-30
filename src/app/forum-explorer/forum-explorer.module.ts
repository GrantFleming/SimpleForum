import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForumExplorerComponent} from './components/forum-explorer/forum-explorer.component';
import {ForumListComponent} from './components/forum-list/forum-list.component';
import {ForumInfoComponent} from './components/forum-info/forum-info.component';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [ForumExplorerComponent, ForumListComponent, ForumInfoComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule
  ]
})
export class ForumExplorerModule {
}
