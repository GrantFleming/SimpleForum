import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {distinctUntilChanged, throttleTime} from 'rxjs/operators';

const circleEffectMagnitude = 0.009;
const textEffectMagnitude = 0.005;
const descriptionEffectMagnitude = 0.01;

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit, OnDestroy {

  // values to be applied to the 'transform' style
  // of the appropriate elements
  circleTranslate: string;
  statusTranslate: string;
  descriptionTranslate: string;

  private mouseListenerSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.initMouseEventHandling();
  }

  /**
   * Update the translation properties according to the specified MouseEvent.
   *
   * The translation performed is to move elements in the opposite direction of the mouse
   * from the centre point of the screen (scaled by a constant magnitude defined as a property.
   *
   * Since the properties should be bound to elements in the template this should
   * result in a change in the view.
   *
   * @param event the mouse event from which we will calculate the required translations.
   */
  updateTranslations(event: MouseEvent) {
    // get the centre
    const xMidpoint = document.body.clientWidth / 2;
    const yMidpoint = document.body.clientHeight / 2;

    // get the cursors distance from the centre
    const xFromCentre = xMidpoint - event.clientX;
    const yFromCentre = yMidpoint - event.clientY;

    // translate elements in the opposite direction relative
    // to the cursors difference from the centre and a pre-defined
    // magnitude.
    this.circleTranslate =
      `translate(${xFromCentre * circleEffectMagnitude}%,
                 ${yFromCentre * circleEffectMagnitude}%)`;
    this.statusTranslate =
      `translate(${xFromCentre * textEffectMagnitude}%,
                 ${yFromCentre * textEffectMagnitude}%)`;
    this.descriptionTranslate =
      `translate(${xFromCentre * descriptionEffectMagnitude}%,
                 ${yFromCentre * descriptionEffectMagnitude}%)`;
  }

  ngOnDestroy() {
    // to remove any necessary event listeners
    this.mouseListenerSubscription.unsubscribe();
  }

  private initMouseEventHandling() {
    this.mouseListenerSubscription = fromEvent(document, 'mousemove')
      .pipe(
        throttleTime(1000 / 24), // set a limit of 24fps
        distinctUntilChanged()
      )
      .subscribe({
        next: (mouseEvent: MouseEvent) => this.updateTranslations(mouseEvent)
      });
  }
}
