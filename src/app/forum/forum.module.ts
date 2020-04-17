import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {ForumComponent} from './components/forum/forum.component';
import {PostFeedComponent} from './components/post-feed/post-feed.component';
import {PostComponent} from './components/post/post.component';
import {AddPostComponent} from './components/add-post/add-post.component';


@NgModule({
  declarations: [
    ForumComponent,
    PostFeedComponent,
    PostComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class ForumModule {
}
