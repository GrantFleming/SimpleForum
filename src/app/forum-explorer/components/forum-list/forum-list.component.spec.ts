import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ForumListComponent} from './forum-list.component';
import {ForumService} from '../../../forum/services/forum.service';
import {asyncData} from '../../../test_utils/test_async_utils';
import {By} from '@angular/platform-browser';
import {Component, Input} from '@angular/core';
import {Forum} from '../../../forum/models/Forum';

describe('ForumListComponent', () => {
  let component: ForumListComponent;
  let fixture: ComponentFixture<ForumListComponent>;

  const testForums: Forum[] = [
    {
      id: 1,
      name: 'name1',
      description: 'description1',
      creator: 'creator1'
    },
    {
      id: 2,
      name: 'name2',
      description: 'description2',
      creator: 'creator2'
    }
  ];
  const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getForums']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForumListComponent,
        MockForumInfoComponent
      ],
      providers: [
        {provide: ForumService, useValue: forumServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    forumServiceSpy.getForums.and.returnValue(asyncData(testForums.slice()));
    fixture = TestBed.createComponent(ForumListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initially contain no forum-info component', () => {
    fixture.detectChanges();
    const forumInfoComponents = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponents.length).toBe(0);
  });

  it('should get forums on initialization', () => {
    fixture.detectChanges();
    expect(forumServiceSpy.getForums).toHaveBeenCalled();
  });

  it('should contain a forum-info for each forum it receives from ForumService', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get forums from service
    fixture.detectChanges();  // update the view
    const forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(testForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(testForums);
    // There will still be a timer on the queue as the completion of every
    // update schedules the next update with setTimeout so we must destroy
    // the fixture to trigger ngOnDestroy which clears the queue
    fixture.destroy();
  }));

  it('should update the forums every 5 seconds', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get forums from service
    tick();                   // get complete from service
    fixture.detectChanges();  // update the view

    const newForums: Forum[] = [
      {
        id: 9,
        name: 'new name',
        description: 'new description',
        creator: 'new creator'
      }
    ];
    forumServiceSpy.getForums.and.returnValue(asyncData(newForums));
    tick(5000);
    fixture.detectChanges();
    let forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(newForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(newForums);

    const moreNewForums: Forum[] = [
      {
        id: 12,
        name: 'another new name',
        description: 'another new description',
        creator: 'another creator'
      }
    ];
    forumServiceSpy.getForums.and.returnValue(asyncData(moreNewForums));

    // after 4999 millis the old data should still be in the view
    tick(4999);
    fixture.detectChanges();
    forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(newForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(newForums);
    // then after 5000 the new data should be in the view
    tick(1);
    fixture.detectChanges();
    forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(moreNewForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(moreNewForums);

    fixture.destroy(); // to remove it's update timer from the queue
  }));

  it('should add valid forums to the view via addForum', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get forums from service
    fixture.detectChanges();  // update the view with initial forums

    const newForum: Forum = {
      id: 666,
      name: 'a newer forum',
      description: 'a newer description',
      creator: 'a creator'
    };

    component.addForum(newForum);
    fixture.detectChanges();
    const forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(testForums.length + 1);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(testForums.concat(newForum));

    fixture.destroy(); // remove any queued update timer
  }));

  it('should not add null or undefined forums', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit
    tick();                   // get forums from service
    fixture.detectChanges();  // update the view with initial forums

    // a new component should not be created for null
    component.addForum(null);
    fixture.detectChanges();
    let forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(testForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(testForums);

    // nor for undefined
    component.addForum(undefined);
    fixture.detectChanges();
    forumInfoComponentsDes = fixture.debugElement.queryAll(By.css('app-forum-info'));
    expect(forumInfoComponentsDes.length).toBe(testForums.length);
    expect(forumInfoComponentsDes.map(value => value.componentInstance.forum)).toEqual(testForums);

    fixture.destroy(); // remove any queued update timer
  }));
});

@Component({
  selector: 'app-forum-info',
  template: ''
})
class MockForumInfoComponent {
  @Input() forum: Forum;
}
