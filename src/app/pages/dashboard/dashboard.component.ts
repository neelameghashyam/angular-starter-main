import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { WidgetComponent } from 'src/app/widget/widget/widget.component';
import { Widget } from 'src/app/models/dashboard';
import { DashboardService } from 'src/app/service/dashboard.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import{MatMenuModule}from'@angular/material/menu'
import{wrapGrid}from 'animate-css-grid'
@Component({
  selector: 'app-dashboard',
  imports: [WidgetComponent,MatIcon,MatButtonModule,MatMenuModule],
  providers:[DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
store= inject(DashboardService)
dashboard = viewChild.required<ElementRef>('dashboard');

ngOnInit() { 
  wrapGrid(this.dashboard().nativeElement, { duration: 300 });
}
}
