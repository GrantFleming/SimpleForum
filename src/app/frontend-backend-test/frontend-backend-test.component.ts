import {Component, OnInit} from '@angular/core';
import {PostService} from '../services/post.service';
import {Post} from '../models/post';

@Component({
  selector: 'app-frontend-backend-test',
  templateUrl: './frontend-backend-test.component.html',
  styleUrls: ['./frontend-backend-test.component.css']
})
export class FrontendBackendTestComponent implements OnInit {

  posts: Post[];

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      return this.posts = posts;
    });
  }

}
