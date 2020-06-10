// Material stubs for unit testing components

import {Component} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-card',
  template: '<ng-content></ng-content>'
})
class MatCardStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-card-title',
  template: '<ng-content></ng-content>'
})
class MatCardTitleStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-card-subtitle',
  template: '<ng-content></ng-content>'
})
class MatCardSubtitleStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-card-content',
  template: '<ng-content></ng-content>'
})
class MatCardContentStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-form-field',
  template: '<ng-content></ng-content>'
})
class MatFormFieldStubComponent {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-label',
  template: '<ng-content></ng-content>'
})
class MatLabelStubComponent {
}

export const materialStubs = [
  MatCardStubComponent,
  MatCardContentStubComponent,
  MatCardTitleStubComponent,
  MatCardSubtitleStubComponent,
  MatFormFieldStubComponent,
  MatLabelStubComponent
];
