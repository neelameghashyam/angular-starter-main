import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../user.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { ResponsiveService } from '../responsive.service';
import { filter } from 'rxjs/operators';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jest.Mocked<UserService>;
  let router: Router;
  let responsiveService: { isHandset$: any };

  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
  ];

  beforeEach(async () => {
    const userServiceMock = {
      getUsers: jest.fn().mockReturnValue(of(mockUsers)),
      deleteUser: jest.fn().mockReturnValue(of({})),
      users$: of(mockUsers)
    };

    const responsiveServiceMock = {
      isHandset$: of(false)
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        RouterTestingModule,
        UserListComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ResponsiveService, useValue: responsiveServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    router = TestBed.inject(Router);
    responsiveService = TestBed.inject(ResponsiveService);

    component.paginator = {
      page: of(),
      length: mockUsers.length,
      pageIndex: 0,
      pageSize: 10,
    } as unknown as MatPaginator;

    component.sort = {
      sortChange: of(),
      active: '',
      direction: '',
    } as unknown as MatSort;

    fixture.detectChanges();
  });

  // Basic Component Tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with users from service', () => {
    expect(component.users).toEqual(mockUsers);
    expect(component.dataSource.data).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalled();
  });

  // Navigation Tests
  it('should navigate to edit page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.editUser(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should navigate to add page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.addUser();
    expect(navigateSpy).toHaveBeenCalledWith(['/add']);
  });

  // Data Operations Tests
  it('should call deleteUser', () => {
    component.deleteUser(1);
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
  });

  // Filter Tests
  describe('Filter Controls', () => {
    it('should update filter on idFilter change', fakeAsync(() => {
      const spy = jest.spyOn(component.dataSource, 'filter', 'set');
      component.idFilter.setValue('1');
      tick(300); // Debounce time
      expect(spy).toHaveBeenCalledWith(JSON.stringify({
        id: '1', firstName: '', lastName: '', email: ''
      }));
    }));

    it('should update filter on firstNameFilter change', fakeAsync(() => {
      const spy = jest.spyOn(component.dataSource, 'filter', 'set');
      component.firstNameFilter.setValue('John');
      tick(300);
      expect(spy).toHaveBeenCalledWith(JSON.stringify({
        id: '', firstName: 'John', lastName: '', email: ''
      }));
    }));

    it('should update filter on lastNameFilter change', fakeAsync(() => {
      const spy = jest.spyOn(component.dataSource, 'filter', 'set');
      component.lastNameFilter.setValue('Doe');
      tick(300);
      expect(spy).toHaveBeenCalledWith(JSON.stringify({
        id: '', firstName: '', lastName: 'Doe', email: ''
      }));
    }));

    it('should update filter on emailFilter change', fakeAsync(() => {
      const spy = jest.spyOn(component.dataSource, 'filter', 'set');
      component.emailFilter.setValue('test@example.com');
      tick(300);
      expect(spy).toHaveBeenCalledWith(JSON.stringify({
        id: '', firstName: '', lastName: '', email: 'test@example.com'
      }));
    }));

    it('should combine multiple filters', fakeAsync(() => {
      const spy = jest.spyOn(component.dataSource, 'filter', 'set');
      component.idFilter.setValue('1');
      component.firstNameFilter.setValue('John');
      component.lastNameFilter.setValue('Doe');
      component.emailFilter.setValue('john@example.com');
      tick(300);
      expect(spy).toHaveBeenCalledWith(JSON.stringify({
        id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com'
      }));
    }));
  });

  // Responsive Tests
  it('should show mobile view', fakeAsync(() => {
    responsiveService.isHandset$ = of(true);
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(2);
    expect(component.displayedColumns).toEqual(['id', 'firstName', 'actions']);
  }));

  it('should show desktop view', fakeAsync(() => {
    responsiveService.isHandset$ = of(false);
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
    expect(component.displayedColumns).toEqual(
      ['id', 'firstName', 'lastName', 'email', 'actions']
    );
  }));

  // Edge Cases
  it('should handle empty user list', () => {
    userService.users$ = of([]);
    component.ngOnInit();
    expect(component.users).toEqual([]);
    expect(component.dataSource.data).toEqual([]);
  });

  it('should unsubscribe on destroy', () => {
    component['subscription'] = new Subscription();
    const spy = jest.spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  // Filter Function Tests
  describe('createFilter()', () => {
    const testData = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com' 
    };

    it('should match exact values', () => {
      const filterFn = component.createFilter();
      const result = filterFn(testData, JSON.stringify({
        id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com'
      }));
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const filterFn = component.createFilter();
      const result = filterFn(testData, JSON.stringify({
        id: '1', firstName: 'john', lastName: 'doe', email: 'JOHN@example.com'
      }));
      expect(result).toBe(true);
    });

    it('should handle partial matches', () => {
      const filterFn = component.createFilter();
      const result = filterFn(testData, JSON.stringify({
        id: '', firstName: 'Jo', lastName: 'Do', email: 'example'
      }));
      expect(result).toBe(true);
    });

    it('should return false for no match', () => {
      const filterFn = component.createFilter();
      const result = filterFn(testData, JSON.stringify({
        id: '2', firstName: 'Jane', lastName: 'Smith', email: 'no-match'
      }));
      expect(result).toBe(false);
    });
  });

  // Router Events Test
  it('should refresh on navigation end', () => {
    const newUsers = [{ id: 3, firstName: 'New', lastName: 'User', email: 'new@test.com' }];
    userService.users$ = of(newUsers);
    
    (router.events as any) = of(new NavigationEnd(1, '/', '/'));
    component.ngOnInit();
    
    expect(component.users).toEqual(newUsers);
    expect(userService.getUsers).toHaveBeenCalledTimes(2);
  });

  // Additional test to cover the direct getUsers().subscribe() call
  it('should call getUsers directly on init', () => {
    // Reset mock calls count
    userService.getUsers.mockClear();
    
    // Reinitialize component
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    
    // Set up ViewChild mocks
    component.paginator = {
      page: of(),
      length: mockUsers.length,
      pageIndex: 0,
      pageSize: 10,
    } as unknown as MatPaginator;

    component.sort = {
      sortChange: of(),
      active: '',
      direction: '',
    } as unknown as MatSort;

    fixture.detectChanges();
    
    // Verify the direct getUsers call was made
    expect(userService.getUsers).toHaveBeenCalledTimes(1);
  });

  // Add these tests inside the existing describe block

  // Error Handling Tests
  it('should handle error when getting users', () => {
    const error = new Error('Test Error');
    userService.getUsers.mockReturnValueOnce(of([])); // First call in ngOnInit
    userService.getUsers.mockReturnValueOnce(throwError(() => error));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Trigger the error by simulating a navigation end event
    (router.events as any) = of(new NavigationEnd(1, '/', '/'));
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching users', error);
  });

  // Paginator and Sort Tests
  it('should update data source when paginator changes', fakeAsync(() => {
    const newUsers = Array(25).fill(0).map((_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      email: `user${i + 1}@test.com`
    }));

    userService.getUsers.mockReturnValueOnce(of(newUsers));
    component.ngOnInit();
    fixture.detectChanges();

    // Simulate paginator change
    component.paginator = {
      page: of({ pageIndex: 1, pageSize: 5, length: newUsers.length }),
      length: newUsers.length,
      pageIndex: 1,
      pageSize: 5,
    } as unknown as MatPaginator;

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBe(component.sort);
  }));

  // Filter Edge Cases
  it('should handle null/undefined values in filter', () => {
    const filterFn = component.createFilter();
    const testData = { 
      id: 1, 
      firstName: null, 
      lastName: undefined, 
      email: 'john@example.com' 
    };

    // Test with null/undefined filter values
    expect(filterFn(testData, JSON.stringify({
      id: '', firstName: '', lastName: '', email: 'john'
    }))).toBe(true);

    expect(filterFn(testData, JSON.stringify({
      id: '', firstName: 'null', lastName: 'undefined', email: ''
    }))).toBe(false);
  });

  // ngOnDestroy Edge Cases
  it('should not throw error when destroying with no subscription', () => {
    component['subscription'] = undefined;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  // Router Events Edge Cases
  it('should handle non-NavigationEnd router events', () => {
    const newUsers = [{ id: 3, firstName: 'New', lastName: 'User', email: 'new@test.com' }];
    userService.users$ = of(newUsers);
    
    // Simulate a non-NavigationEnd event
    (router.events as any) = of(new NavigationStart(1, '/'));
    component.ngOnInit();
    
    // Should still have initial users, not the new ones
    expect(component.users).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalledTimes(1);
  });

  // Additional Filter Tests
  it('should handle empty filter object', () => {
    const filterFn = component.createFilter();
    const testData = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com' 
    };

    expect(filterFn(testData, '{}')).toBe(true);
    expect(filterFn(testData, '')).toBe(true);
  });

  // Test for clearFilters method if it exists
  it('should clear all filters', fakeAsync(() => {
    component.idFilter.setValue('1');
    component.firstNameFilter.setValue('John');
    component.lastNameFilter.setValue('Doe');
    component.emailFilter.setValue('john@example.com');
    
    component.clearFilters();
    tick(300);
    
    expect(component.idFilter.value).toBe('');
    expect(component.firstNameFilter.value).toBe('');
    expect(component.lastNameFilter.value).toBe('');
    expect(component.emailFilter.value).toBe('');
    expect(component.dataSource.filter).toBe(JSON.stringify({
      id: '', firstName: '', lastName: '', email: ''
    }));
  }));
});

