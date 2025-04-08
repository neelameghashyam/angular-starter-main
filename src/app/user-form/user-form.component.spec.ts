import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../user.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserFormComponent (Jest)', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Create mock services to avoid real HTTP or Router behavior
    mockUserService = {
      getUser: jest.fn(),
      addUser: jest.fn(),
      updateUser: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        params: {},
      },
    };

    // Configure the test module with the standalone component and mocks
    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    // Create the component and trigger initial lifecycle
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Basic instantiation test
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields in add mode', () => {
    // Confirm the form is initialized correctly when not editing
    expect(component.userForm).toBeDefined();
    expect(component.userForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: ''
    });
    expect(component.isEdit).toBe(false);
  });

  it('should fetch user and patch form if userId exists (edit mode)', () => {
    // Simulate route param for edit mode
    const userMock = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
    mockActivatedRoute.snapshot.params = { id: 1 };
    mockUserService.getUser.mockReturnValue(of(userMock));

    // Trigger component logic
    component.ngOnInit();

    expect(component.isEdit).toBe(true);
    expect(mockUserService.getUser).toHaveBeenCalledWith(1);

    // Optional: test value patching manually
    mockUserService.getUser(1).subscribe(() => {
      expect(component.userForm.value).toEqual(userMock);
    });
  });

  it('should call addUser and navigate on submit in add mode', () => {
    // Set form values and simulate successful add
    const formData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    };
    component.userForm.setValue(formData);
    mockUserService.addUser.mockReturnValue(of({}));

    component.onSubmit();

    expect(mockUserService.addUser).toHaveBeenCalledWith(formData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call updateUser and navigate on submit in edit mode', () => {
    // Simulate edit mode with existing user ID
    const formData = {
      firstName: 'Edited',
      lastName: 'User',
      email: 'edited@example.com',
    };
    component.isEdit = true;
    component.userId = 5;
    component.userForm.setValue(formData);
    mockUserService.updateUser.mockReturnValue(of({}));

    component.onSubmit();

    expect(mockUserService.updateUser).toHaveBeenCalledWith(5, formData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit the form if it is invalid', () => {
    // Set invalid form data and attempt to submit
    component.userForm.setValue({
      firstName: '',
      lastName: '',
      email: 'invalid-email' // Assume email pattern validator exists
    });

    component.onSubmit();

    expect(mockUserService.addUser).not.toHaveBeenCalled();
    expect(mockUserService.updateUser).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
