import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://dummyjson.com/users';
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    console.log('[UserService] Fetching all users...');
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      tap(res => {
        console.log('[UserService] Users fetched:', res.users);
        this.usersSubject.next(res.users);
      })
    );
  }

  getUser(id: number): Observable<any> {
    console.log(`[UserService] Fetching user with id: ${id}`);
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      tap(user => console.log('[UserService] User fetched:', user))
    );
  }

  addUser(user: any): Observable<any> {
    console.log('[UserService] Adding new user:', user);
    return this.http.post(`${this.baseUrl}/add`, user).pipe(
      tap((newUser: any) => {
        console.log('[UserService] User added response:', newUser);
        const current = this.usersSubject.getValue();
        const enrichedUser = { id: current.length + 1, ...newUser };
        const updatedList = [...current, enrichedUser];
        console.log('[UserService] Updated user list after add:', updatedList);
        this.usersSubject.next(updatedList);
      })
    );
  }

  updateUser(id: number, user: any): Observable<any> {
    console.log(`[UserService] Updating user with id: ${id}`, user);
    return this.http.put(`${this.baseUrl}/${id}`, user).pipe(
      tap((updatedUser: any) => {
        console.log('[UserService] User updated response:', updatedUser);
        const current = this.usersSubject.getValue();
        const updatedList = current.map(u => u.id === id ? { ...u, ...updatedUser } : u);
        console.log('[UserService] Updated user list after update:', updatedList);
        this.usersSubject.next(updatedList);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    console.log(`[UserService] Deleting user with id: ${id}`);
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const current = this.usersSubject.getValue();
        const filtered = current.filter(u => u.id !== id);
        console.log('[UserService] Updated user list after delete:', filtered);
        this.usersSubject.next(filtered);
      })
    );
  }
}
