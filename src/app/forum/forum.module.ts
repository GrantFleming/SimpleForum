import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PostFeedComponent} from './components/post-feed/post-feed.component';
import {PostComponent} from './components/post/post.component';
import {AddPostComponent} from './components/add-post/add-post.component';
import {ForumComponent} from './components/forum/forum.component';


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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ForumModule {
}
