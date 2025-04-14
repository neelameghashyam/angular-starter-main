import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetOptionsComponent } from './widget-options.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Widget } from 'src/app/models/dashboard';
import { By } from '@angular/platform-browser';
import { Type } from '@angular/core';

describe('WidgetOptionsComponent', () => {
  let component: WidgetOptionsComponent;
  let fixture: ComponentFixture<WidgetOptionsComponent>;
  let mockDashboardService: jest.Mocked<DashboardService>;

  // Create a mock class for the content type
  class MockContentType {}

  const mockWidget: Widget = {
    id: 1,
    rows: 2,
    columns: 3,
    label: 'Test Widget',
    content: MockContentType // Changed to use the Type
  };

  beforeEach(async () => {
    mockDashboardService = {
      updateWidget: jest.fn(),
      moveWidgetToRight: jest.fn(),
      moveWidgetToLeft: jest.fn(),
      removeWidget: jest.fn()
    } as unknown as jest.Mocked<DashboardService>;

    await TestBed.configureTestingModule({
      imports: [MatButtonToggleModule, MatIcon],
      declarations: [WidgetOptionsComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetOptionsComponent);
    component = fixture.componentInstance;
    
    // Using type assertion to set input value
    (component.data as any) = mockWidget;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showOptions as false', () => {
    expect(component.showOptions()).toBe(false);
  });

  it('should display width toggle group with correct initial value', () => {
    const widthGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:first-child'));
    expect(widthGroup).toBeTruthy();
    expect(widthGroup.nativeElement.getAttribute('value')).toBe('3');
  });

  it('should display height toggle group with correct initial value', () => {
    const heightGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:last-child'));
    expect(heightGroup).toBeTruthy();
    expect(heightGroup.nativeElement.getAttribute('value')).toBe('2');
  });

  it('should call updateWidget with new columns when width is changed', () => {
    const widthGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:first-child'));
    widthGroup.triggerEventHandler('change', { value: '4' });
    
    expect(mockDashboardService.updateWidget).toHaveBeenCalledWith(1, { columns: 4 });
  });

  it('should call updateWidget with new rows when height is changed', () => {
    const heightGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:last-child'));
    heightGroup.triggerEventHandler('change', { value: '1' });
    
    expect(mockDashboardService.updateWidget).toHaveBeenCalledWith(1, { rows: 1 });
  });

  it('should call moveWidgetToRight when right chevron is clicked', () => {
    const rightButton = fixture.debugElement.query(By.css('.move-forward-button'));
    rightButton.triggerEventHandler('click', null);
    
    expect(mockDashboardService.moveWidgetToRight).toHaveBeenCalledWith(1);
  });

  it('should call moveWidgetToLeft when left chevron is clicked', () => {
    const leftButton = fixture.debugElement.query(By.css('.move-backward-button'));
    leftButton.triggerEventHandler('click', null);
    
    expect(mockDashboardService.moveWidgetToLeft).toHaveBeenCalledWith(1);
  });

  it('should call removeWidget when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('.remove-widget-button'));
    deleteButton.triggerEventHandler('click', null);
    
    expect(mockDashboardService.removeWidget).toHaveBeenCalledWith(1);
  });

  it('should set showOptions to false when close button is clicked', () => {
    component.showOptions.set(true);
    fixture.detectChanges();
    
    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    closeButton.triggerEventHandler('click', null);
    
    expect(component.showOptions()).toBe(false);
  });

  it('should render all width options (1-4)', () => {
    const widthOptions = fixture.debugElement.queryAll(By.css('mat-button-toggle-group:first-child mat-button-toggle'));
    expect(widthOptions.length).toBe(4);
    expect(widthOptions[0].nativeElement.textContent.trim()).toBe('1');
    expect(widthOptions[1].nativeElement.textContent.trim()).toBe('2');
    expect(widthOptions[2].nativeElement.textContent.trim()).toBe('3');
    expect(widthOptions[3].nativeElement.textContent.trim()).toBe('4');
  });

  it('should render all height options (1-4)', () => {
    const heightOptions = fixture.debugElement.queryAll(By.css('mat-button-toggle-group:last-child mat-button-toggle'));
    expect(heightOptions.length).toBe(4);
    expect(heightOptions[0].nativeElement.textContent.trim()).toBe('1');
    expect(heightOptions[1].nativeElement.textContent.trim()).toBe('2');
    expect(heightOptions[2].nativeElement.textContent.trim()).toBe('3');
    expect(heightOptions[3].nativeElement.textContent.trim()).toBe('4');
  });

  it('should have correct positioning for move buttons', () => {
    const rightButton = fixture.debugElement.query(By.css('.move-forward-button'));
    const leftButton = fixture.debugElement.query(By.css('.move-backward-button'));
    
    expect(rightButton.styles['right']).toBe('-5px');
    expect(leftButton.styles['left']).toBe('-5px');
    expect(rightButton.styles['top']).toBe('50%');
    expect(leftButton.styles['top']).toBe('50%');
  });

  it('should have red color for remove button', () => {
    const removeButton = fixture.debugElement.query(By.css('.remove-widget-button'));
    expect(removeButton.styles['color']).toBe('red');
  });

  it('should have close button positioned top right', () => {
    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    expect(closeButton.styles['position']).toBe('absolute');
    expect(closeButton.styles['top']).toBe('0');
    expect(closeButton.styles['right']).toBe('0');
  });

  it('should handle undefined rows/columns by defaulting to 1', () => {
    // Create new test data with undefined rows/columns
    const testData = { 
      ...mockWidget, 
      rows: undefined, 
      columns: undefined 
    };
    (component.data as any) = testData;
    fixture.detectChanges();
    
    const widthGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:first-child'));
    const heightGroup = fixture.debugElement.query(By.css('mat-button-toggle-group:last-child'));
    
    expect(widthGroup.nativeElement.getAttribute('value')).toBe('1');
    expect(heightGroup.nativeElement.getAttribute('value')).toBe('1');
  });
});