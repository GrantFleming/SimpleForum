import {Component, OnDestroy, OnInit} from '@angular/core';
import {Forum} from '../../../forum/models/Forum';
import {ForumService} from '../../../forum/services/forum.service';
import {forumArrayEquals} from '../../../forum/utils/utils';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent implements OnInit, OnDestroy {

  forums: Forum[];
  private nextUpdate;

  constructor(private forumService: ForumService) {
  }

  ngOnInit(): void {
    this._getForums();
  }

  ngOnDestroy(): void {
    // Clear any pending updates from the task queue to
    // avoid memory leaks
    clearTimeout(this.nextUpdate);
  }

  /**
   * Get a list of forums from the server continuously and updates this.forums if
   * the list received differs from the forums property.
   *
   * If the list received is the same then the forum property is not updated
   * so as to not trigger a view rendering in change detection.
   *
   * After receiving a list of forums, schedule a task to request them
   * again after 5 seconds.
   */
  private _getForums() {
    this.forumService.getForums()
      .pipe(
        // filter out results which match what we already have
        filter(forums => !forumArrayEquals(forums, this.forums))
      )
      .subscribe({
        next: forums => this.forums = forums,
        complete: () => this.nextUpdate = setTimeout(() => this._getForums(), 5000)
      });
  }

  /**
   * Add a new forum to the list.
   *
   * Useful to instantly add forums on creating rather than waiting
   * for subsequent get requests after post request.
   *
   * @param forum to be added to the list
   */
  addForum(forum: Forum) {
    if (forum) {
      this.forums.push(forum);
    }
  }
}
