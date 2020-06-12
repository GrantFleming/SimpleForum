import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Forum} from '../../models/Forum';
import {concatMap} from 'rxjs/operators';
import {ForumService} from '../../services/forum.service';
import {AuthenticationService} from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  forum: Forum;

  constructor(
    public route: ActivatedRoute,
    private forumService: ForumService,
    private router: Router,
    public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      concatMap(
        params => this.forumService.getForum(+params.get('id'))
      )
    ).subscribe(
      forum => this.forum = forum,
      () => this.router.navigateByUrl('/page-not-found', {replaceUrl: true})
    );
  }
}
