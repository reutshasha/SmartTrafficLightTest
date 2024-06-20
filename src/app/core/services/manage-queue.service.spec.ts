import { TestBed } from '@angular/core/testing';

import { ManageQueueService } from './manage-queue.service';

describe('ManageQueueService', () => {
  let service: ManageQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
