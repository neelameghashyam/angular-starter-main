import { Component,input } from '@angular/core';
import { Widget } from 'src/app/models/dashboard';
import { NgComponentOutlet } from '@angular/common';


@Component({
  selector: 'app-widget',
  imports: [NgComponentOutlet],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {
  data = input.required<Widget>()
}
