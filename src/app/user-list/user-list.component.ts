import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'actions'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Load initial users
    this.userService.getUsers().subscribe();

    // Refresh on navigation (like after add/edit)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.userService.getUsers().subscribe();
      });

    // Keep UI synced with service data
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe();
  }

  editUser(id: number) {
    this.router.navigate(['/edit', id]);
  }

  addUser() {
    this.router.navigate(['/add']);
  }
}
