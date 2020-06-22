import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForumInfoComponent} from './forum-info.component';
import {Forum} from '../../../forum/models/Forum';
import {Component, DebugElement, Directive, HostListener, Input} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';

describe('ForumInfoComponent', () => {
  let wrapper: WrapperComponent;
  let component: ForumInfoComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  let testForum: Forum;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule
      ],
      declarations: [
        ForumInfoComponent,
        WrapperComponent,
        RouterLinkSpyDirective
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testForum = {
      id: 1,
      name: 'default',
      description: 'default',
      creator: 'the creator'
    };
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement
      .query(By.css('app-forum-info'))
      .componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the forum name somewhere', () => {
    const testName = 'test name';
    testForum.name = testName;
    wrapper.forum = testForum;
    fixture.detectChanges();
    const titleDe = fixture.debugElement.query(By.css('.name'));
    expect(titleDe.nativeElement.textContent).toEqual(testName);
  });

  it('should display the forum description somewhere', () => {
    const testDesc = 'test name';
    testForum.description = testDesc;
    wrapper.forum = testForum;
    fixture.detectChanges();
    const titleDe = fixture.debugElement.query(By.css('.desc'));
    expect(titleDe.nativeElement.textContent).toEqual(testDesc);
  });

  it('should display the forum creator', () => {
    wrapper.forum = testForum;
    fixture.detectChanges();
    const creatorDe: DebugElement = fixture.debugElement.query(By.css('.creator'));
    const creatorNe = creatorDe.nativeElement;
    expect(creatorNe.textContent).toEqual(testForum.creator);
  });

  it('should contain a button to the described forum', () => {
    const testForumId = 9;
    testForum.id = testForumId;
    wrapper.forum = testForum;
    fixture.detectChanges();

    // button should exist
    const buttonDe = fixture.debugElement.query(By.css('button.forum-button'));
    expect(buttonDe).toBeTruthy();

    // clicking the button should request routerLink to navigate to the correct url
    const routerLink = buttonDe.injector.get(RouterLinkSpyDirective);
    buttonDe.nativeElement.click();
    expect(routerLink.navigatedTo).toEqual('/forums/' + testForumId);
  });
});

@Component({
  template: '<app-forum-info [forum]="forum"></app-forum-info>'
})
class WrapperComponent {
  forum: Forum;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]'
})
class RouterLinkSpyDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: string;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams
      .reduce(
        (acc, cur) => acc + cur,
        ''
      );
  }
}
