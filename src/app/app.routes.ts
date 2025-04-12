import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentComponent } from './pages/content/content.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { YoutubeSidebarComponent } from './youtube-sidebar/youtube-sidebar.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'add', component: UserFormComponent },
  { path: 'edit/:id', component: UserFormComponent },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  
  { 
    path: 'youtube-dashboard',
    component: YoutubeSidebarComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'content', component: ContentComponent, title: 'Content' },
      { path: 'analytics', component: AnalyticsComponent, title: 'Analytics' },
      { path: 'comments', component: CommentsComponent, title: 'Comments' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
