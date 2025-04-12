import { Component, computed, Host, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import{MatSidenavModule}from '@angular/material/sidenav'
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';



@Component({
  selector: 'app-youtube-sidebar',
  imports: [RouterOutlet, CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatSidenavModule, CustomSidenavComponent],
  templateUrl: './youtube-sidebar.component.html',
  styleUrl: './youtube-sidebar.component.scss'
})
export class YoutubeSidebarComponent {
  title = 'sidebar';
  collapsed=signal(false)

  sidenavWidth = computed(()=> this.collapsed() ? '65px':'250px')
}
