import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from 'src/app/service/dashboard.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WidgetComponent } from 'src/app/widget/widget/widget.component';
import { By } from '@angular/platform-browser';
import { Widget } from 'src/app/models/dashboard';

// Mock the wrapGrid function
jest.mock('animate-css-grid', () => ({
  wrapGrid: jest.fn().mockImplementation(() => jest.fn())
}));

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;

  const mockWidgetsToAdd: Widget[] = [
    {
      id: 1, label: 'Widget 1',
      content: undefined
    },
    {
      id: 2, label: 'Widget 2',
      content: undefined
    }
  ];

  const mockAddedWidgets: Widget[] = [
    {
      id: 3, label: 'Added Widget 1',
      content: undefined
    },
    {
      id: 4, label: 'Added Widget 2',
      content: undefined
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, WidgetComponent],
      imports: [MatMenuModule, MatButtonModule, MatIconModule],
      providers: [DashboardService]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    
    // Mock service methods
    jest.spyOn(dashboardService, 'widgetsToAdd').mockReturnValue(mockWidgetsToAdd);
    jest.spyOn(dashboardService, 'addedWidgets').mockReturnValue(mockAddedWidgets);
    jest.spyOn(dashboardService, 'addWidget').mockImplementation((widget: Widget) => {
      mockAddedWidgets.push(widget);
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with grid animation', () => {
    const { wrapGrid } = require('animate-css-grid');
    expect(wrapGrid).toHaveBeenCalledWith(component.dashboard().nativeElement, { duration: 300 });
  });

  it('should display the correct header title', () => {
    const header = fixture.debugElement.query(By.css('.header h2'));
    expect(header.nativeElement.textContent).toBe('Channel Dashboard');
  });

  it('should render the "Add widget" button with icon', () => {
    const button = fixture.debugElement.query(By.css('.header button'));
    expect(button.nativeElement.textContent.trim()).toBe('add_circleAdd widget');
    expect(button.nativeElement.classList).toContain('mat-raised-button');
  });

  it('should display widgets to add in the menu', () => {
    const addButton = fixture.debugElement.query(By.css('.header button'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
    expect(menuItems.length).toBe(mockWidgetsToAdd.length);
    
    menuItems.forEach((item, index) => {
      expect(item.nativeElement.textContent.trim()).toBe(mockWidgetsToAdd[index].label);
    });
  });

  it('should call addWidget when a menu item is clicked', () => {
    const initialCount = mockAddedWidgets.length;
    const addButton = fixture.debugElement.query(By.css('.header button'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
    menuItems[0].triggerEventHandler('click', null);
    
    expect(dashboardService.addWidget).toHaveBeenCalledWith(mockWidgetsToAdd[0]);
    expect(mockAddedWidgets.length).toBe(initialCount + 1);
  });

  it('should display "No Widgets To Add" when widgetsToAdd is empty', () => {
    jest.spyOn(dashboardService, 'widgetsToAdd').mockReturnValue([]);
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.header button'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
    expect(menuItems.length).toBe(1);
    expect(menuItems[0].nativeElement.textContent.trim()).toBe('No Widgets To Add');
  });

  it('should render all added widgets in the dashboard', () => {
    const widgets = fixture.debugElement.queryAll(By.css('app-widget'));
    expect(widgets.length).toBe(mockAddedWidgets.length);
    
    widgets.forEach((widget, index) => {
      expect(widget.componentInstance.data).toEqual(mockAddedWidgets[index]);
    });
  });

  it('should apply correct grid styling to dashboard', () => {
    const dashboardEl = fixture.debugElement.query(By.css('.dashboard-widgets'));
    const styles = window.getComputedStyle(dashboardEl.nativeElement);
    
    expect(styles.display).toBe('grid');
    expect(styles.gridTemplateColumns).toContain('repeat(auto-fit, minmax(200px, 1fr)');
    expect(styles.gridAutoRows).toBe('150px');
    expect(styles.gap).toBe('16px');
  });

  it('should have correct container styling', () => {
    const containerEl = fixture.debugElement.query(By.css('.dashboard-container'));
    const styles = window.getComputedStyle(containerEl.nativeElement);
    
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    expect(styles.height).toBe('100vh');
    expect(styles.padding).toBe('16px');
    expect(styles.boxSizing).toBe('border-box');
    expect(styles.backgroundColor).toBe('rgb(245, 245, 245)');
  });

  it('should have correct header styling', () => {
    const headerEl = fixture.debugElement.query(By.css('.header'));
    const styles = window.getComputedStyle(headerEl.nativeElement);
    
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.alignItems).toBe('center');
  });

  it('should update dashboard when widgets are added', () => {
    const initialWidgetCount = fixture.debugElement.queryAll(By.css('app-widget')).length;
    
    // Add a new widget
    const newWidget: Widget = {
      id: 5, label: 'New Widget',
      content: undefined
    };
    jest.spyOn(dashboardService, 'addedWidgets').mockReturnValue([...mockAddedWidgets, newWidget]);
    fixture.detectChanges();

    const updatedWidgets = fixture.debugElement.queryAll(By.css('app-widget'));
    expect(updatedWidgets.length).toBe(initialWidgetCount + 1);
    expect(updatedWidgets[updatedWidgets.length - 1].componentInstance.data).toEqual(newWidget);
  });
});