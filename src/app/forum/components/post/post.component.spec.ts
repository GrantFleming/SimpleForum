import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostComponent} from './post.component';
import {Post} from '../../models/post';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let expectedPost: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    expectedPost = {id: 1, title: 'A post title', body: 'A post body'};
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

  it('should display the body', () => {
    const bodyDe: DebugElement = fixture.debugElement.query(By.css('.body'));
    const bodyNe = bodyDe.nativeElement;
    expect(bodyNe.textContent).toBe(expectedPost.body);
  });
});
