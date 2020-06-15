import {Component} from '@angular/core';
import {AuthenticationService} from '../authentication/services/authentication.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  constructor(public authService: AuthenticationService) {
  }
}
