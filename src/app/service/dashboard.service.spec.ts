import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { SubscribersComponent } from '../pages/dashboard/widgets/subscribers/subscribers.component';
import { ViewsComponent } from '../pages/dashboard/widgets/views/views.component';
import { WatchTimeComponent } from '../pages/dashboard/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../pages/dashboard/widgets/revenue/revenue.component';
import { AnalyticsComponent } from '../pages/dashboard/widgets/analytics/analytics.component';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService]  // Add this line to provide the service
    });
    service = TestBed.inject(DashboardService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with 5 default widgets', () => {
      expect(service.widgets().length).toBe(5);
      expect(service.widgets()[0]).toEqual({
        id: 1,
        label: 'Subscribers',
        content: SubscribersComponent,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke'
      });
      expect(service.widgets()[4]).toEqual({
        id: 5,
        label: 'Channel Analytics',
        content: AnalyticsComponent,
        rows: 2,
        columns: 2
      });
    });

    it('should initialize with empty addedWidgets', () => {
      expect(service.addedWidgets().length).toBe(0);
    });
  });

  describe('widgetsToAdd', () => {
    it('should return all widgets when none are added', () => {
      expect(service.widgetsToAdd()).toEqual(service.widgets());
    });

    it('should exclude added widgets', () => {
      service.addWidget(service.widgets()[0]);
      const result = service.widgetsToAdd();
      expect(result.length).toBe(4);
      expect(result.some(w => w.id === 1)).toBe(false);
    });

    it('should return empty array when all widgets are added', () => {
      service.widgets().forEach(w => service.addWidget(w));
      expect(service.widgetsToAdd()).toEqual([]);
    });
  });

  describe('fetchWidgets', () => {
    it('should do nothing when localStorage is empty', () => {
      service.fetchWidgets();
      expect(service.addedWidgets().length).toBe(0);
    });

    it('should load widgets from localStorage', () => {
      const mockWidgets = [
        { id: 1, label: 'Subscribers', rows: 1, columns: 1, backgroundColor: '#003f5c', color: 'whitesmoke' },
        { id: 2, label: 'Views', rows: 1, columns: 1, backgroundColor: '#003f5c', color: 'whitesmoke' }
      ];
      localStorage.setItem('dashboardWidgets', JSON.stringify(mockWidgets));
      
      service.fetchWidgets();
      
      expect(service.addedWidgets().length).toBe(2);
      expect(service.addedWidgets()[0].id).toBe(1);
      expect(service.addedWidgets()[0].content).toBe(SubscribersComponent);
      expect(service.addedWidgets()[1].id).toBe(2);
      expect(service.addedWidgets()[1].content).toBe(ViewsComponent);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('dashboardWidgets', 'invalid json');
      expect(() => service.fetchWidgets()).not.toThrow();
      expect(service.addedWidgets().length).toBe(0);
    });

    it('should handle missing content mapping', () => {
      const mockWidgets = [{ id: 999, label: 'Non-existent' }];
      localStorage.setItem('dashboardWidgets', JSON.stringify(mockWidgets));
      
      service.fetchWidgets();
      
      expect(service.addedWidgets().length).toBe(1);
      expect(service.addedWidgets()[0].content).toBeUndefined();
    });
  });

  describe('addWidget', () => {
    it('should add a widget to addedWidgets', () => {
      const widget = service.widgets()[0];
      service.addWidget(widget);
      expect(service.addedWidgets().length).toBe(1);
      expect(service.addedWidgets()[0].id).toBe(widget.id);
    });

    it('should create a new object and not modify the original', () => {
      const widget = service.widgets()[0];
      service.addWidget(widget);
      expect(service.addedWidgets()[0]).not.toBe(widget);
    });

    it('should maintain existing widgets when adding new ones', () => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
      expect(service.addedWidgets().length).toBe(2);
    });
  });

  describe('updateWidget', () => {
    beforeEach(() => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
    });

    it('should update an existing widget', () => {
      service.updateWidget(1, { label: 'Updated Label', rows: 2 });
      const updatedWidget = service.addedWidgets().find(w => w.id === 1);
      expect(updatedWidget?.label).toBe('Updated Label');
      expect(updatedWidget?.rows).toBe(2);
    });

    it('should not modify other widgets', () => {
      const originalWidget2 = {...service.addedWidgets()[1]};
      service.updateWidget(1, { label: 'Updated' });
      expect(service.addedWidgets()[1]).toEqual(originalWidget2);
    });

    it('should do nothing when widget not found', () => {
      const originalWidgets = [...service.addedWidgets()];
      service.updateWidget(999, { label: 'Should not update' });
      expect(service.addedWidgets()).toEqual(originalWidgets);
    });
  });

  describe('moveWidgetToRight', () => {
    beforeEach(() => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
      service.addWidget(service.widgets()[2]);
    });

    it('should move widget to the right', () => {
      service.moveWidgetToRight(1);
      expect(service.addedWidgets()[0].id).toBe(2);
      expect(service.addedWidgets()[1].id).toBe(1);
      expect(service.addedWidgets()[2].id).toBe(3);
    });

    it('should not move the last widget', () => {
      service.moveWidgetToRight(3);
      expect(service.addedWidgets()[2].id).toBe(3);
    });

    it('should do nothing for non-existent widget', () => {
      const originalWidgets = [...service.addedWidgets()];
      service.moveWidgetToRight(999);
      expect(service.addedWidgets()).toEqual(originalWidgets);
    });
  });

  describe('moveWidgetToLeft', () => {
    beforeEach(() => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
      service.addWidget(service.widgets()[2]);
    });

    it('should move widget to the left', () => {
      service.moveWidgetToLeft(2);
      expect(service.addedWidgets()[0].id).toBe(2);
      expect(service.addedWidgets()[1].id).toBe(1);
      expect(service.addedWidgets()[2].id).toBe(3);
    });

    it('should not move the first widget', () => {
      service.moveWidgetToLeft(1);
      expect(service.addedWidgets()[0].id).toBe(1);
    });

    it('should do nothing for non-existent widget', () => {
      const originalWidgets = [...service.addedWidgets()];
      service.moveWidgetToLeft(999);
      expect(service.addedWidgets()).toEqual(originalWidgets);
    });
  });

  describe('removeWidget', () => {
    beforeEach(() => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
    });

    it('should remove the specified widget', () => {
      service.removeWidget(1);
      expect(service.addedWidgets().length).toBe(1);
      expect(service.addedWidgets()[0].id).toBe(2);
    });

    it('should do nothing when widget not found', () => {
      const originalWidgets = [...service.addedWidgets()];
      service.removeWidget(999);
      expect(service.addedWidgets()).toEqual(originalWidgets);
    });
  });

  describe('saveWidgets effect', () => {
    it('should save to localStorage when widgets change', () => {
      service.addWidget(service.widgets()[0]);
      
      const saved = localStorage.getItem('dashboardWidgets');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(1);
      expect(parsed[0].content).toBeUndefined();
    });

    it('should save after multiple operations', () => {
      service.addWidget(service.widgets()[0]);
      service.addWidget(service.widgets()[1]);
      service.removeWidget(1);
      
      const saved = localStorage.getItem('dashboardWidgets');
      const parsed = JSON.parse(saved!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(2);
    });
  });

  describe('widget content mapping', () => {
    it('should correctly map all component types', () => {
      const widgets = service.widgets();
      expect(widgets[0].content).toBe(SubscribersComponent);
      expect(widgets[1].content).toBe(ViewsComponent);
      expect(widgets[2].content).toBe(WatchTimeComponent);
      expect(widgets[3].content).toBe(RevenueComponent);
      expect(widgets[4].content).toBe(AnalyticsComponent);
    });

    it('should restore content when loading from localStorage', () => {
      const mockWidgets = [
        { id: 1, label: 'Subscribers' },
        { id: 2, label: 'Views' }
      ];
      localStorage.setItem('dashboardWidgets', JSON.stringify(mockWidgets));
      
      service.fetchWidgets();
      
      expect(service.addedWidgets()[0].content).toBe(SubscribersComponent);
      expect(service.addedWidgets()[1].content).toBe(ViewsComponent);
    });
  });
});