import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostComponent} from './post.component';
import {Post} from '../../models/post';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let expectedPost: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [
        MatCardModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    expectedPost = {id: 1, forumId: 1, title: 'A post title', body: 'A post body', creator: 'The Creator'};
    component.post = expectedPost;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleDe: DebugElement = fixture.debugElement.query(By.css('.title'));
    const titleNe = titleDe.nativeElement;
    expect(titleNe.textContent).toBe(expectedPost.title);
  });

  it('should display the creator', () => {
    const creatorDe: DebugElement = fixture.debugElement.query(By.css('.creator'));
    const creatorNe = creatorDe.nativeElement;
    expect(creatorNe.textContent).toBe(expectedPost.creator);
  });

  it('should display the body', () => {
    const bodyDe: DebugElement = fixture.debugElement.query(By.css('.body'));
    const bodyNe = bodyDe.nativeElement;
    expect(bodyNe.textContent).toBe(expectedPost.body);
  });
});
