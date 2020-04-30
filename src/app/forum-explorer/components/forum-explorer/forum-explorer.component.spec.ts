import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumExplorerComponent} from './forum-explorer.component';
import {By} from '@angular/platform-browser';
import {Component, EventEmitter, Output} from '@angular/core';
import {Forum} from '../../../forum/models/Forum';

describe('ForumExplorerComponent', () => {
  let component: ForumExplorerComponent;
  let fixture: ComponentFixture<ForumExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForumExplorerComponent,
        MockForumListComponent,
        MockAddForumComponent
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

  it('should display an AddForumComponent', () => {
    const addForumDe = fixture.debugElement.query(By.css('app-add-forum'));
    expect(addForumDe).toBeTruthy();
  });

  it('should call addForum in the ForumList on a newForumEvent passing the new forum', () => {
    const eventEmitter = fixture.debugElement
      .query(By.css('app-add-forum'))
      .componentInstance
      .newForumEvent;
    const mockForumList = fixture.debugElement
      .query(By.css('app-forum-list'))
      .componentInstance;

    const testForum: Forum = {
      id: null,
      name: null,
      description: null
    };

    eventEmitter.emit(testForum);
    expect(mockForumList.lastAddedForum).toBe(testForum);
  });
});

@Component({
  selector: 'app-forum-list',
  template: ''
})
class MockForumListComponent {
  private lastAddedForum: Forum;

  addForum(forum: Forum) {
    this.lastAddedForum = forum;
  }
}

@Component({
  selector: 'app-add-forum',
  template: ''
})
class MockAddForumComponent {
  @Output() newForumEvent = new EventEmitter();
}
