import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForumExplorerComponent} from './components/forum-explorer/forum-explorer.component';
import {ForumListComponent} from './components/forum-list/forum-list.component';
import {ForumInfoComponent} from './components/forum-info/forum-info.component';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {AddForumComponent} from './components/add-forum/add-forum.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    ForumExplorerComponent,
    ForumListComponent,
    ForumInfoComponent,
    AddForumComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ]
})
export class ForumExplorerModule {
}
