import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterOutlet} from '@angular/router';

describe('AppComponent', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSidenavModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent,
        MainMenuStubComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'SimpleForumFrontend'`, () => {
    expect(component.title).toEqual('SimpleForumFrontend');
  });

  it('should have a sidenav', () => {
    // should contain the container
    const containerDe = fixture.debugElement.query(By.css('mat-sidenav-container'));
    expect(containerDe).toBeTruthy();

    // should contain the nav bar
    const navBarDe = containerDe.query(By.css('mat-sidenav'));
    expect(navBarDe).toBeTruthy();

    // should contain the nav content
    const contentDe = containerDe.query(By.css('mat-sidenav-content'));
    expect(contentDe).toBeTruthy();
  });

  it('should have a MainMenuComponent inside the sidenav', () => {
    const sidebarDe = fixture.debugElement.query(By.css('mat-sidenav'));
    const menuDe = sidebarDe.query(By.css('app-main-menu'));
    expect(menuDe).toBeTruthy();
  });

  it('should toggle the sidenav if the burger is clicked', () => {
    const sidebarComponent = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance;
    const burgerMenuNe = fixture.debugElement.query(By.css('span.burger_menu')).nativeElement;

    // start with sidebar closed
    sidebarComponent.opened = false;
    burgerMenuNe.click();
    expect(sidebarComponent.opened).toBeTrue();
    burgerMenuNe.click();
    expect(sidebarComponent.opened).toBeFalse();
  });

  it('should have a router outlet in the sidenav content', () => {
    const contentDe = fixture.debugElement.query(By.css('mat-sidenav-content'));
    const routerOutlet = contentDe.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should have a title in the sidenav content', () => {
    const contentDe = fixture.debugElement.query(By.css('mat-sidenav-content'));
    const title = contentDe.query(By.css('h1.siteTitle'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent).toBeTruthy();
  });

  it('should close the sidenav on router-outlet change', () => {
    const routerOutlet: RouterOutlet = fixture.debugElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    const sidebarComponent = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance;

    sidebarComponent.opened = true;
    routerOutlet.activateEvents.emit();
    expect(sidebarComponent.opened).toBeFalse();
  });
});

@Component({
  selector: 'app-main-menu',
  template: ''
})
class MainMenuStubComponent {
}
