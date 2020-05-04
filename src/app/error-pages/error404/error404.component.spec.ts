import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Error404Component} from './error404.component';
import {By} from '@angular/platform-browser';

describe('Error404Component', () => {
  let component: Error404Component;
  let fixture: ComponentFixture<Error404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Error404Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an h1 with an error message', () => {
    const h1De = fixture.debugElement.query(By.css('h1'));

    // There exists an h1 and something is written in it
    expect(h1De).toBeTruthy();
    expect(h1De.nativeElement.textContent).toBeTruthy();
  });

  it('should contain an svg with a circle and a text containing 404', () => {
    const circleDe = fixture.debugElement.query(By.css('svg circle'));
    expect(circleDe).toBeTruthy();
    const textDe = fixture.debugElement.query(By.css('svg text'));
    expect(textDe).toBeTruthy();
    expect(textDe.nativeElement.textContent).toContain('404');
  });

  it('should bind its translate properties to the appropriate elements', () => {
    const descriptionDe = fixture.debugElement.query(By.css('div .text-content'));
    const circleDe = fixture.debugElement.query(By.css('svg circle'));
    const textDe = fixture.debugElement.query(By.css('svg text'));

    const descriptionTranslation = 'translate(192px, 0px)';
    const statusTranslation = 'translate(-123px, 451px)';
    const circleTranslation = 'translate(99px, 99px)';

    component.descriptionTranslate = descriptionTranslation;
    component.circleTranslate = circleTranslation;
    component.statusTranslate = statusTranslation;
    fixture.detectChanges();

    expect(descriptionDe.styles.transform).toBe(descriptionTranslation);
    expect(circleDe.styles.transform).toBe(circleTranslation);
    expect(textDe.styles.transform).toBe(statusTranslation);
  });

  it('should call updateTranslations on mouse move', () => {
    spyOn(component, 'updateTranslations');
    expect(component.updateTranslations).not.toHaveBeenCalled();
    document.dispatchEvent(new Event('mousemove'));
    fixture.detectChanges();
    expect(component.updateTranslations).toHaveBeenCalled();
  });

  it('should calculate translations that translate in the opposite direction to the mouse', () => {
    const centre = [document.body.clientWidth / 2, document.body.clientHeight / 2];

    // if mouse is left of centre all translations should be rightward
    let mousePosition = new MouseEvent('mousemove', {clientX: centre[0] - 1});
    component.updateTranslations(mousePosition);
    getTranslationValues().forEach(
      coordinate =>
        expect(coordinate[0]).toBeGreaterThan(0, 'did not translate right'));

    // if mouse is right of centre all translations should be leftward
    mousePosition = new MouseEvent('mousemove', {clientX: centre[0] + 1});
    component.updateTranslations(mousePosition);
    getTranslationValues().forEach(
      coordinate =>
        expect(coordinate[0]).toBeLessThan(0, 'did not translate left'));

    // if mouse is above centre translations should be downward
    mousePosition = new MouseEvent('mousemove', {clientY: centre[1] - 1});
    component.updateTranslations(mousePosition);
    getTranslationValues().forEach(
      coordinate =>
        expect(coordinate[1]).toBeGreaterThan(0, 'did not translate down'));

    // if x is below centre translations should be upward
    mousePosition = new MouseEvent('mousemove', {clientY: centre[1] + 1});
    component.updateTranslations(mousePosition);
    getTranslationValues().forEach(
      coordinate =>
        expect(coordinate[1]).toBeLessThan(0, 'did not translate up'));

    function getTranslationValues() {
      return [component.descriptionTranslate,
        component.circleTranslate,
        component.statusTranslate]
        // pluck out just X and Y from 'translate(X%, Y%)'
        .map(property => property.split(/%,\s|\s|%\)|translate\(/)
          .filter(x => x)
          .map(val => parseFloat(val)));
    }
  });
});
