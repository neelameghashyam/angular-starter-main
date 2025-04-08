import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import standalone component and HttpClientTestingModule
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Prevent errors from unknown Angular Material tags
    }).compileComponents();

    // Create component instance and trigger Angular change detection
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Check if the component was instantiated successfully
    expect(component).toBeTruthy();
  });
});
