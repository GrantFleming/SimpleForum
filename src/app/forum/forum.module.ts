import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PostFeedComponent} from './components/post-feed/post-feed.component';
import {PostComponent} from './components/post/post.component';
import {AddPostComponent} from './components/add-post/add-post.component';
import {ForumComponent} from './components/forum/forum.component';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    ForumComponent,
    PostFeedComponent,
    PostComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule
  ]
})
export class ForumModule {
}
