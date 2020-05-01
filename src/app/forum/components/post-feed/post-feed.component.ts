import {AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';

@Component({
  selector: 'app-post-feed[forumId]',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {

  @Input() forumId: number;
  posts: Post[];
  newPost = false;
  private nextUpdate;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
      If the @Input()'s have changed, validate them, cancel
      the next scheduled update and instead do one immediately
     */
    this._checkAttributes();
    clearTimeout(this.nextUpdate);
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

  ngOnDestroy(): void {
    // to avoid memory leaks
    clearTimeout(this.nextUpdate);
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

  private _getPosts() {
    // keep the posts up to date, every time returned observable completes,
    // schedule the next call
    this.postService.getPosts(this.forumId).subscribe({
      next: posts => {
        this.posts = posts;
      },
      complete: () => {
        this.nextUpdate = setTimeout(() => this._getPosts(), 5000);
      }
    });
  }

}
