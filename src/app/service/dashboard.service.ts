import { Component, computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../models/dashboard';
import { SubscribersComponent } from '../pages/dashboard/widgets/subscribers/subscribers.component';
import { ViewsComponent } from '../pages/dashboard/widgets/views/views.component';
import { WatchTimeComponent } from '../pages/dashboard/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../pages/dashboard/widgets/revenue/revenue.component';
import { AnalyticsComponent } from '../pages/dashboard/widgets/analytics/analytics.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([ 
    { 
    id: 1, 
    label: 'Subscribers', 
    content: SubscribersComponent, 
    rows: 1, 
    columns: 1, 
    backgroundColor: '#003f5c', 
    color: 'whitesmoke'
    }, 
    { 
      id: 2, 
      label: 'Views', 
      content: ViewsComponent, 
      rows: 1, 
      columns: 1, 
      backgroundColor: '#003f5c', 
      color: 'whitesmoke'
      },
      { 
        id: 3, 
        label: 'Watch Time', 
        content: WatchTimeComponent, 
        rows: 1, 
        columns: 1, 
        backgroundColor: '#003f5c', 
        color: 'whitesmoke'
        }, 
        { 
          id: 4, 
          label: 'Revenue', 
          content: RevenueComponent, 
          rows: 1, 
          columns: 1, 
          backgroundColor: '#003f5c', 
          color: 'whitesmoke'
          },
          { 
            id: 5, 
            label: 'Channel Analytics', 
            content: AnalyticsComponent, 
            rows: 2, 
            columns: 2, 
            },
    ]);

addedWidgets = signal<Widget[]>([
  
]); 
widgetsToAdd = computed(() => { 
const addedIds = this.addedWidgets().map(w => w.id); 
return this.widgets().filter(w => !addedIds.includes (w.id));
})


fetchWidgets() { 
  const widgetsAsString = localStorage.getItem('dashboardWidgets'); 
  if(widgetsAsString) { 
  const widgets = JSON.parse(widgetsAsString) as Widget[]; 
  widgets.forEach (widget => { 
  const content = this.widgets().find(w => w.id === widget.id)?.content; 
  if (content) { 
  widget.content = content; 
  } 
  }) 
  this.addedWidgets.set(widgets) 
  } 
  }

addWidget (w: Widget) { 
  this.addedWidgets.set([...this.addedWidgets(), { ...w}]);
}

updateWidget(id: number, widget: Partial<Widget>) { 
  const index = this.addedWidgets().findIndex (w => w.id === id); 
  if (index !== -1){ 
  const newWidgets = [...this.addedWidgets()]; 
  newWidgets [index] = { ...newWidgets [index], ...widget }; 
  this.addedWidgets.set(newWidgets); 
  }
}

moveWidgetToRight(id: number) { 
  const index = this.addedWidgets().findIndex(w => w.id === id); 
  if (index === this.addedWidgets().length - 1) { 
  return; 
  } 
  const newWidgets= [...this.addedWidgets()]; 
  [newWidgets [index], newWidgets [index + 1]] = [{ ...newWidgets [index + 1] }, { ...newWidgets [index]}]; 
  this.addedWidgets.set(newWidgets);
}

moveWidgetToLeft(id: number) {
  const index = this.addedWidgets().findIndex(w => w.id === id); 
  if (index ===0) { 
  return; 
  } 
  const newWidgets= [...this.addedWidgets()]; 
  [newWidgets [index], newWidgets [index - 1]] = [{ ...newWidgets [index - 1] }, { ...newWidgets [index]}]; 
  this.addedWidgets.set(newWidgets);
}

removeWidget(id: number) { 
  this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
}

  constructor() {
    this.fetchWidgets();
  }

  saveWidgets = effect(() => { 
    const widgetsWithoutContent: Partial<Widget> [] = this.addedWidgets().map(w => ({ ...w })); 
    widgetsWithoutContent.forEach(w => { 
    delete w.content; 
    }); 
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsWithoutContent));
    })

}
