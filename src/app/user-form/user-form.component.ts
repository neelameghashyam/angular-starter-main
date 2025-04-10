import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../responsive.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  isEdit = false;
  isHandset$ = this.responsiveService.isHandset$;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private responsiveService: ResponsiveService 
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEdit = true;
      this.userService.getUser(this.userId).subscribe((user) => {
        this.userForm.patchValue(user);
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEdit) {
      this.userService.updateUser(this.userId, userData).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.userService.addUser(userData).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
