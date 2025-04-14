import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static users$(users$: any) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'https://dummyjson.com/users';
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  static getUsers: any;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      tap(res => {
        this.usersSubject.next(res.users);
      })
    );
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, user).pipe(
      tap((newUser: any) => {
        const current = this.usersSubject.getValue();
        const enrichedUser = { id: current.length + 1, ...newUser };
        const updatedList = [...current, enrichedUser];
        this.usersSubject.next(updatedList);
      })
    );
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, user).pipe(
      tap((updatedUser: any) => {
        const current = this.usersSubject.getValue();
        const updatedList = current.map(u => u.id === id ? { ...u, ...updatedUser } : u);
        this.usersSubject.next(updatedList);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const current = this.usersSubject.getValue();
        const filtered = current.filter(u => u.id !== id);
        this.usersSubject.next(filtered);
      })
    );
  }
}
