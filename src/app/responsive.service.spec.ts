import { TestBed } from '@angular/core/testing';
import { ResponsiveService } from './responsive.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('ResponsiveService', () => {
  let service: ResponsiveService;
  let mockBreakpointObserver: jest.Mocked<BreakpointObserver>;

  // Helper function to create a BreakpointState mock
  const createBreakpointState = (matches: boolean): BreakpointState => ({
    matches,
    breakpoints: {
      [Breakpoints.Handset]: matches,
      [Breakpoints.Tablet]: matches,
      [Breakpoints.Web]: matches
    }
  });

  beforeEach(() => {
    // Create a mock BreakpointObserver with proper BreakpointState return type
    mockBreakpointObserver = {
      observe: jest.fn().mockReturnValue(of(createBreakpointState(false))),
    } as unknown as jest.Mocked<BreakpointObserver>;

    TestBed.configureTestingModule({
      providers: [
        ResponsiveService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    });

    service = TestBed.inject(ResponsiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isHandset$', () => {
    it('should return true when handset breakpoint matches', () => {
      mockBreakpointObserver.observe.mockReturnValueOnce(of(createBreakpointState(true)));

      service.isHandset$.subscribe(result => {
        expect(result).toBe(true);
      });

      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith([Breakpoints.Handset]);
    });

    it('should return false when handset breakpoint does not match', () => {
      service.isHandset$.subscribe(result => {
        expect(result).toBe(false);
      });
    });
  });

  describe('isTablet$', () => {
    it('should return true when tablet breakpoint matches', () => {
      mockBreakpointObserver.observe.mockReturnValueOnce(of(createBreakpointState(true)));

      service.isTablet$.subscribe(result => {
        expect(result).toBe(true);
      });

      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith([Breakpoints.Tablet]);
    });

    it('should return false when tablet breakpoint does not match', () => {
      service.isTablet$.subscribe(result => {
        expect(result).toBe(false);
      });
    });
  });

  describe('isWeb$', () => {
    it('should return true when web breakpoint matches', () => {
      mockBreakpointObserver.observe.mockReturnValueOnce(of(createBreakpointState(true)));

      service.isWeb$.subscribe(result => {
        expect(result).toBe(true);
      });

      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith([Breakpoints.Web]);
    });

    it('should return false when web breakpoint does not match', () => {
      service.isWeb$.subscribe(result => {
        expect(result).toBe(false);
      });
    });
  });

  it('should use shareReplay for all observables', () => {
    // Verify that each observable has shareReplay behavior by checking multiple subscriptions
    mockBreakpointObserver.observe.mockReturnValueOnce(of(createBreakpointState(true)));

    let firstResult: boolean | undefined;
    let secondResult: boolean | undefined;

    // First subscription
    service.isHandset$.subscribe(result => {
      firstResult = result;
    });

    // Second subscription should get the same value without calling observe again
    service.isHandset$.subscribe(result => {
      secondResult = result;
    });

    expect(firstResult).toBe(true);
    expect(secondResult).toBe(true);
    expect(mockBreakpointObserver.observe).toHaveBeenCalledTimes(1);
  });
});