import {TestBed} from '@angular/core/testing';

import {ForumServiceCacheHeater} from './forum-service-cache-heater.service';
import {ForumService} from './forum.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {EMPTY, throwError} from 'rxjs';

describe('ForumServiceCacheHeaterService', () => {
  let service: ForumServiceCacheHeater;

  const mockForumService = jasmine.createSpyObj(ForumService, ['getForum']);
  const mockRouter = jasmine.createSpyObj(Router, ['navigateByUrl']);
  const mockActivatedRouteSnapshot = {paramMap: {get: () => '3'}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ForumService, useValue: mockForumService},
        {provide: Router, useValue: mockRouter}
      ]
    });
    service = TestBed.inject(ForumServiceCacheHeater);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the forum from the service', () => {
    mockForumService.getForum.and.returnValue(EMPTY);
    service.resolve(mockActivatedRouteSnapshot as unknown as ActivatedRouteSnapshot, null);
    expect(mockForumService.getForum).toHaveBeenCalledWith(3);
  });

  it('should navigate to "/page-not-found" if the ForumService errors', () => {
    mockForumService.getForum.and.returnValue(throwError('any'));
    service.resolve(mockActivatedRouteSnapshot as unknown as ActivatedRouteSnapshot, null).subscribe();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/page-not-found', jasmine.anything());
  });
});
