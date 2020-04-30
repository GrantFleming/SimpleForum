import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumExplorerComponent} from './forum-explorer.component';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

describe('ForumExplorerComponent', () => {
  let component: ForumExplorerComponent;
  let fixture: ComponentFixture<ForumExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForumExplorerComponent,
        MockForumListComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a forum list', () => {
    const forumListDe = fixture.debugElement.query(By.css('app-forum-list'));
    expect(forumListDe).toBeTruthy();
  });
});

@Component({
  selector: 'app-forum-list',
  template: ''
})
class MockForumListComponent {
}
