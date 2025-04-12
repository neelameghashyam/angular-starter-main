import { Component, computed, Input, signal } from '@angular/core';
import{MatListModule} from '@angular/material/list'
import{MatIconModule} from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule,MatListModule,MatIconModule,RouterModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent {
  menuItems = signal<MenuItem[]>([
    {
    icon:"dashboard",
    label:"Dashboard",
    route:"dashboard",
    },
    {
      icon:"video_library",
      label:"Content",
      route:"content",
      },
      {
        icon:"analytics",
        label:"Analytics",
        route:"analytics",
        },
        {
          icon:"comment",
          label:"Comments",
          route:"comments",
          }
  ])

  sideNavCollapsed = signal(false)
  @Input() set collapsed(val:boolean){
    this.sideNavCollapsed.set(val)
  }

  profilePicSize = computed(() => (this.sideNavCollapsed() ? '32' : '100'));
}
