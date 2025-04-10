import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ResponsiveService } from '../responsive.service';
import { of, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;
  let mockResponsiveService: jest.Mocked<ResponsiveService>;
  let routerEventsSubject: Subject<any>;

  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
  ];

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    
    mockUserService = {
      getUsers: jest.fn().mockReturnValue(of({ users: mockUsers })),
      deleteUser: jest.fn().mockReturnValue(of({})),
      users$: of(mockUsers)
    } as unknown as jest.Mocked<UserService>;

    mockRouter = {
      navigate: jest.fn(),
      events: routerEventsSubject.asObservable()
    } as unknown as jest.Mocked<Router>;

    mockResponsiveService = {
      isHandset$: of(false) // Default to desktop view
    } as unknown as jest.Mocked<ResponsiveService>;

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent, // Import standalone component
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        AsyncPipe,
        MatIcon
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ResponsiveService, useValue: mockResponsiveService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct columns', () => {
    expect(component.displayedColumns).toEqual(['id', 'firstName', 'lastName', 'email', 'actions']);
    expect(component.mobileColumns).toEqual(['id', 'firstName', 'actions']);
  });

  it('should call getUsers on init', () => {
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });

  it('should subscribe to users$ and update users list', () => {
    expect(component.users).toEqual(mockUsers);
  });

  it('should refresh users on NavigationEnd event', () => {
    mockUserService.getUsers.mockClear();
    routerEventsSubject.next(new NavigationEnd(1, '/', '/'));
    expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
  });

  it('should render desktop table when not in handset mode', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
    
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(5); // 5 columns in desktop view
  });

  it('should call deleteUser when delete button is clicked', () => {
    // Find all delete buttons (color="warn")
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
    deleteButtons[0].triggerEventHandler('click', null);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('should call editUser when edit button is clicked', () => {
    // Find all edit buttons (color="primary") and exclude the Add User button
    const allPrimaryButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));
    const editButtons = allPrimaryButtons.filter(btn => 
      !btn.nativeElement.textContent.includes('Add User')
    );
    editButtons[0].triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', mockUsers[0].id]);
  });

  it('should navigate to add route when add button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button.mat-raised-button'));
    expect(addButton).toBeTruthy();
    addButton.triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add']);
  });

  describe('Mobile view', () => {
    beforeEach(() => {
      // Change to mobile view
      mockResponsiveService.isHandset$ = of(true);
      fixture = TestBed.createComponent(UserListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render cards when in handset mode', () => {
      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeNull();
      
      const cards = fixture.debugElement.queryAll(By.css('mat-card'));
      expect(cards.length).toBe(mockUsers.length);
    });

    it('should call deleteUser when delete button is clicked in mobile view', () => {
      const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
      deleteButtons[0].triggerEventHandler('click', null);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
    });

    it('should call editUser when edit button is clicked in mobile view', () => {
      const editButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));
      editButtons[0].triggerEventHandler('click', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', mockUsers[0].id]);
    });
  });
});