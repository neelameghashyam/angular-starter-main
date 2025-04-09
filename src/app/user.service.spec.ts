import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let consoleSpy: jest.SpyInstance;

  const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    
    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    httpMock.verify();
    consoleSpy.mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch users and update BehaviorSubject', () => {
      const mockResponse = { users: mockUsers };

      service.getUsers().subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      // Check the BehaviorSubject update
      service.users$.subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('https://dummyjson.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(consoleSpy).toHaveBeenCalledWith('[UserService] Fetching all users...');
      expect(consoleSpy).toHaveBeenCalledWith('[UserService] Users fetched:', mockUsers);
    });

    it('should handle error when getting users', () => {
      service.getUsers().subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.status).toEqual(500)
      });

      const req = httpMock.expectOne('https://dummyjson.com/users');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getUser', () => {
    it('should fetch a single user', () => {
      const userId = 1;
      const mockUser = mockUsers[0];

      service.getUser(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      expect(consoleSpy).toHaveBeenCalledWith(`[UserService] Fetching user with id: ${userId}`);
      expect(consoleSpy).toHaveBeenCalledWith('[UserService] User fetched:', mockUser);
    });

    it('should handle error when getting a user', () => {
      const userId = 999;

      service.getUser(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.status).toEqual(404)
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addUser', () => {
    it('should add a user and update BehaviorSubject', () => {
      const newUser = { firstName: 'New', lastName: 'User', email: 'new@example.com' };
      const mockResponse = { id: 3, ...newUser };

      // Set initial state
      (service as any).usersSubject = new BehaviorSubject<any[]>(mockUsers);
      service.users$ = (service as any).usersSubject.asObservable();

      service.addUser(newUser).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://dummyjson.com/users/add');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      // Check the BehaviorSubject was updated
      service.users$.subscribe(users => {
        expect(users.length).toBe(3);
        expect(users[2]).toEqual({ id: 3, ...mockResponse });
      });

      expect(consoleSpy).toHaveBeenCalledWith('[UserService] Adding new user:', newUser);
      expect(consoleSpy).toHaveBeenCalledWith('[UserService] User added response:', mockResponse);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UserService] Updated user list after add:',
        expect.arrayContaining([...mockUsers, { id: 3, ...mockResponse }])
      );
    });

    it('should handle error when adding a user', () => {
      const newUser = { firstName: 'New', lastName: 'User', email: 'new@example.com' };

      service.addUser(newUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.status).toEqual(400)
      });

      const req = httpMock.expectOne('https://dummyjson.com/users/add');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should update a user and update BehaviorSubject', () => {
      const userId = 1;
      const updatedUserData = { firstName: 'Updated' };
      const mockResponse = { ...mockUsers[0], ...updatedUserData };

      // Set initial state
      (service as any).usersSubject = new BehaviorSubject<any[]>(mockUsers);
      service.users$ = (service as any).usersSubject.asObservable();

      service.updateUser(userId, updatedUserData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);

      // Check the BehaviorSubject was updated
      service.users$.subscribe(users => {
        expect(users.length).toBe(2);
        expect(users.find(u => u.id === userId)?.firstName).toBe('Updated');
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[UserService] Updating user with id: ${userId}`,
        updatedUserData
      );
      expect(consoleSpy).toHaveBeenCalledWith('[UserService] User updated response:', mockResponse);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UserService] Updated user list after update:',
        expect.arrayContaining([mockResponse, mockUsers[1]])
      );
    });

    it('should handle error when updating a user', () => {
      const userId = 999;
      const updatedUserData = { firstName: 'Updated' };

      service.updateUser(userId, updatedUserData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.status).toEqual(404)
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and update BehaviorSubject', () => {
      const userId = 1;

      // Set initial state
      (service as any).usersSubject = new BehaviorSubject<any[]>(mockUsers);
      service.users$ = (service as any).usersSubject.asObservable();

      service.deleteUser(userId).subscribe();

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      // Check the BehaviorSubject was updated
      service.users$.subscribe(users => {
        expect(users.length).toBe(1);
        expect(users.find(u => u.id === userId)).toBeUndefined();
      });

      expect(consoleSpy).toHaveBeenCalledWith(`[UserService] Deleting user with id: ${userId}`);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[UserService] Updated user list after delete:',
        [mockUsers[1]]
      );
    });

    it('should handle error when deleting a user', () => {
      const userId = 999;

      service.deleteUser(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.status).toEqual(404)
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should not modify users list when delete fails', () => {
      const userId = 1;

      // Set initial state
      (service as any).usersSubject = new BehaviorSubject<any[]>(mockUsers);
      service.users$ = (service as any).usersSubject.asObservable();

      service.deleteUser(userId).subscribe({
        next: () => fail('should have failed'),
        error: () => {
          service.users$.subscribe(users => {
            expect(users).toEqual(mockUsers);
          });
        }
      });

      const req = httpMock.expectOne(`https://dummyjson.com/users/${userId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});