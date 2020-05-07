import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {PostFeedComponent} from './components/post-feed/post-feed.component';
import {PostComponent} from './components/post/post.component';
import {AddPostComponent} from './components/add-post/add-post.component';
import {ForumComponent} from './components/forum/forum.component';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {ForumRoutingModule} from './forum-routing.module';

@NgModule({
  declarations: [
    ForumComponent,
    PostFeedComponent,
    PostComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    ForumRoutingModule
  ]
})
export class ForumModule {
}
