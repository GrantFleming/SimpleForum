import {AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';

@Component({
  selector: 'app-post-feed[forumId]',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() forumId: number;
  posts: Post[];
  newPost = false;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._checkAttributes();
    this._getPosts();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.newPost = true;
  }

  private _checkAttributes() {
    if (this.forumId === undefined || this.forumId === null) {
      throw new Error('Attribute \'forumId\' cannot be undefined or null.');
    }
  }

  private _getPosts() {
    this.postService.getPosts(this.forumId).subscribe(posts => {
      this.posts = posts;
    });
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
