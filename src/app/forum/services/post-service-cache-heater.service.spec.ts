import {TestBed} from '@angular/core/testing';

import {PostServiceCacheHeater} from './post-service-cache-heater.service';
import {ActivatedRouteSnapshot} from '@angular/router';
import {PostService} from './post.service';
import {EMPTY} from 'rxjs';

describe('PostServiceCacheHeaterService', () => {
  let service: PostServiceCacheHeater;

  const mockPostService = jasmine.createSpyObj(PostService, ['getPosts']);
  const mockActivatedRouteSnapshot = {paramMap: {get: () => '3'}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: PostService, useValue: mockPostService}
      ]
    });
    service = TestBed.inject(PostServiceCacheHeater);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the posts from the service', () => {
    mockPostService.getPosts.and.returnValue(EMPTY);
    service.resolve(mockActivatedRouteSnapshot as unknown as ActivatedRouteSnapshot, null);
    expect(mockPostService.getPosts).toHaveBeenCalledWith(3);
  });
});
