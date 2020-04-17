import {Component, OnInit} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {

  posts: Post[];

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    try {
      this.postService.getPosts().subscribe(posts => this.posts = posts);
    } catch (e) {
      // TODO - something useful if the backend fails to provide a valid response
      this.posts = [];
    }
  }

  addPost(post: Post) {
    this.posts.push(post);
  }

}
