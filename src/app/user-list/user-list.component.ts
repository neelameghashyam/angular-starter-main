import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';
import { ResponsiveService } from '../responsive.service';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    AsyncPipe,
    MatCardModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'actions'];
  mobileColumns = ['id','firstName', 'actions'];

  isHandset$ = this.responsiveService.isHandset$;

  constructor(
    private userService: UserService, 
    private router: Router,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.userService.getUsers().subscribe();
      });

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