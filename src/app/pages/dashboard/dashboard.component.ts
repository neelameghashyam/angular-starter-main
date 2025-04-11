import { Component, inject } from '@angular/core';
import { WidgetComponent } from 'src/app/widget/widget/widget.component';
import { Widget } from 'src/app/models/dashboard';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [WidgetComponent],
  providers:[DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
store= inject(DashboardService)
  
}
