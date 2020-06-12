import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../authentication/services/authentication.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-forum-explorer',
  templateUrl: './forum-explorer.component.html',
  styleUrls: ['./forum-explorer.component.scss']
})
export class ForumExplorerComponent implements OnInit {

  constructor(public authService: AuthenticationService,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

}
