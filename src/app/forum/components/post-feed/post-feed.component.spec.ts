import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PostFeedComponent} from './post-feed.component';
import {PostService} from '../../services/post.service';
import {asyncData} from '../../../test_utils/test_async_utils';
import {Post} from '../../models/post';
import {Component, DebugElement, Input} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('PostFeedComponent', () => {
  let postServiceStub: Partial<PostService>;
  const expectedPosts = [
    {
      id: 1,
      title: 'A post',
      body: 'Some text to make up the body of a post'
    },
    {
      id: 2,
      title: 'Another post',
      body: 'Another body of yet another post'
    }];

  let component: PostFeedComponent;
  let fixture: ComponentFixture<PostFeedComponent>;

  beforeEach(async(() => {

    postServiceStub = {
      getPosts: () => asyncData<Post[]>([...expectedPosts])
    };

    TestBed.configureTestingModule({
      declarations: [PostFeedComponent, StubbedPostComponent],
      providers: [{provide: PostService, useValue: postServiceStub}]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(PostFeedComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have no app-post elements before the server info arrives', fakeAsync(() => {
    fixture.detectChanges(); // OnInit
    // Before the response from the service arrives check no posts are listed:
    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts).toEqual([]);
  }));


  it('should create an app-post component for each post it retrieves from the server', fakeAsync(() => {
    fixture.detectChanges(); // onInit
    tick(); // to get the asynchronous result from service
    fixture.detectChanges(); // notify angular that data needs rebound to template
    expect(component.posts.length).toBe(2);

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(2);
  }));


  it('should pass the posts to the PostComponent children', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.posts.length).toBe(2);

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts[0].componentInstance.post).toBe(expectedPosts[0]);
    expect(appPosts[1].componentInstance.post).toBe(expectedPosts[1]);
  }));

  it('#addPost should add another post to the component', fakeAsync(() => {
    fixture.detectChanges(); // OnInit
    tick(); // to allow the asynchronous loading of posts from server

    component.addPost({id: 3, title: 'a third post', body: 'a third body'});
    expect(component.posts.length).toBe(3);
  }));


  it('#addPost should result in a new post being rendered in the template', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const testPost: Post = {id: 3, title: 'a third post', body: 'a third body'};
    component.addPost(testPost);
    fixture.detectChanges();

    const appPosts: DebugElement[] = fixture.debugElement.queryAll(By.css('app-post'));
    expect(appPosts.length).toBe(3);
    expect(appPosts[2].componentInstance.post).toEqual(testPost);
  }));
});


@Component({
  selector: 'app-post',
  template: ''
})
class StubbedPostComponent {
  @Input() post: Post;
}
