import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit, AfterViewChecked {

  posts: Post[];
  newPost = false;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.newPost = true;
  }

  /**
   * If a new post has been added to the feed, scroll down by the height
   * of the new real estate on the screen
   */
  ngAfterViewChecked(): void {
    if (this.newPost) {
      const lastPost = document.querySelector('app-post.last');
      scrollBy(0, lastPost.scrollHeight + lastPost.children.item(0).clientHeight);
      this.newPost = false;
    }
  }
}
