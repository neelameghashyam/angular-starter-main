import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Configure testing module with HTTP client mock and service provider
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    // Inject the service and HTTP mock controller
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no HTTP requests remain outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    // Basic test to ensure service is instantiated correctly
    expect(service).toBeTruthy();
  });
});
