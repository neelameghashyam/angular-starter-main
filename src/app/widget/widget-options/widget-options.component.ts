import { Component, inject, input, model } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Widget } from 'src/app/models/dashboard';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
    selector: 'app-widget-options',
    imports: [MatIcon, MatButtonToggleModule],
    templateUrl: './widget-options.component.html',
    styleUrl: './widget-options.component.scss'
})
export class WidgetOptionsComponent {
    data = input.required<Widget>(); 
    showOptions = model<boolean>(false);
    store = inject(DashboardService);
}