import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;
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

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent, // Import standalone component
        MatButtonModule,
        MatIconModule,
        MatTableModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'id', 'firstName', 'lastName', 'email', 'actions'
    ]);
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

  it('should not refresh users on other router events', () => {
    mockUserService.getUsers.mockClear();
    routerEventsSubject.next({});
    expect(mockUserService.getUsers).not.toHaveBeenCalled();
  });

  it('should render users in the table', () => {
    const tableRows = fixture.debugElement.queryAll(By.css('tr'));
    expect(tableRows.length).toBe(mockUsers.length + 1); // +1 for header
    
    const firstRowCells = tableRows[1].queryAll(By.css('td'));
    // Convert textContent to number for ID comparison
    expect(Number(firstRowCells[0].nativeElement.textContent.trim())).toBe(mockUsers[0].id);
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe(mockUsers[0].firstName);
    expect(firstRowCells[2].nativeElement.textContent.trim()).toBe(mockUsers[0].lastName);
    expect(firstRowCells[3].nativeElement.textContent.trim()).toBe(mockUsers[0].email);
  });

  it('should call deleteUser when delete button is clicked', () => {
    // Find all buttons and filter for delete button (assuming it has a specific class)
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find(btn => 
      btn.nativeElement.textContent.includes('Delete')
    );
    
    deleteButton?.triggerEventHandler('click', null);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('should call editUser with correct id when edit button is clicked', () => {
    // Find all buttons and filter for edit button (assuming it has a specific class)
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const editButton = buttons.find(btn => 
      btn.nativeElement.textContent.includes('Edit')
    );
    
    editButton?.triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', mockUsers[0].id]);
  });

  it('should navigate to add route when add button is clicked', () => {
    // Find the add button by a specific class or text
    const addButton = fixture.debugElement.query(By.css('button.add-button'));
    if (!addButton) {
      // Alternative selector if class isn't working
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const addBtn = buttons.find(btn => 
        btn.nativeElement.textContent.includes('Add')
      );
      addBtn?.triggerEventHandler('click', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/add']);
    } else {
      addButton.triggerEventHandler('click', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/add']);
    }
  });

  it('should handle empty users list', () => {
    // Reset with empty users list
    mockUserService.users$ = of([]);
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.users).toEqual([]);
    const tableRows = fixture.debugElement.queryAll(By.css('tr'));
    expect(tableRows.length).toBe(1); // Only header row
  });
});