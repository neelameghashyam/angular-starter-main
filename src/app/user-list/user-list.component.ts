import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';
import { ResponsiveService } from '../responsive.service';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  [x: string]: any;
  users: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'actions'];
  mobileColumns = ['id', 'firstName', 'actions'];

  // Search controls for each column
  idFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  emailFilter = new FormControl();

  filterValues = {
    id: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Custom filter predicate
      this.dataSource.filterPredicate = this.createFilter();
    });

    // Set up filter changes
    this.idFilter.valueChanges.subscribe(value => {
      this.filterValues.id = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.firstNameFilter.valueChanges.subscribe(value => {
      this.filterValues.firstName = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.lastNameFilter.valueChanges.subscribe(value => {
      this.filterValues.lastName = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.emailFilter.valueChanges.subscribe(value => {
      this.filterValues.email = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      let searchTerms = JSON.parse(filter);
      return data.id.toString().toLowerCase().indexOf(searchTerms.id.toLowerCase()) !== -1
        && data.firstName.toLowerCase().indexOf(searchTerms.firstName.toLowerCase()) !== -1
        && data.lastName.toLowerCase().indexOf(searchTerms.lastName.toLowerCase()) !== -1
        && data.email.toLowerCase().indexOf(searchTerms.email.toLowerCase()) !== -1;
    }
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