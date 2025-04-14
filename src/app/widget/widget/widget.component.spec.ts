import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetComponent } from './widget.component';
import { Widget } from 'src/app/models/dashboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

// Mock component for testing content projection
@Component({
  selector: 'mock-content',
  template: '<div class="mock-content">Mock Content</div>'
})
class MockContentComponent {}

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  const mockWidgetData: Widget = {
    id: 1, // Changed to number to match interface
    label: 'Test Widget',
    rows: 1,
    columns: 1,
    content: MockContentComponent,
    backgroundColor: 'white',
    color: 'inherit'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule],
      declarations: [WidgetComponent, MockContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    
    // Create a writable signal mock for the input
    const dataSignal = signal(mockWidgetData);
    
    // Assign the mock to the component's input
    (component as any).data = dataSignal;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    const labelElement = fixture.debugElement.query(By.css('h3'));
    expect(labelElement.nativeElement.textContent).toContain('Test Widget');
  });

  it('should have a settings button', () => {
    const buttonElement = fixture.debugElement.query(By.css('.settings-button'));
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.querySelector('mat-icon').textContent).toContain('settings');
  });

  it('should toggle showOptions when settings button is clicked', () => {
    const buttonElement = fixture.debugElement.query(By.css('.settings-button'));
    expect(component.showOptions()).toBe(false);
    
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    expect(component.showOptions()).toBe(true);
    
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    expect(component.showOptions()).toBe(false);
  });

  it('should display the content component', () => {
    const contentElement = fixture.debugElement.query(By.css('.mock-content'));
    expect(contentElement).toBeTruthy();
    expect(contentElement.nativeElement.textContent).toContain('Mock Content');
  });

  it('should apply default background color when none is provided', () => {
    const newData = {
      ...mockWidgetData,
      backgroundColor: undefined
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const containerElement = fixture.debugElement.query(By.css('.container'));
    expect(containerElement.styles['background-color']).toBe('white');
  });

  it('should apply custom background color when provided', () => {
    const newData = {
      ...mockWidgetData,
      backgroundColor: '#abcdef'
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const containerElement = fixture.debugElement.query(By.css('.container'));
    expect(containerElement.styles['background-color']).toBe('#abcdef');
  });

  it('should apply default text color when none is provided', () => {
    const newData = {
      ...mockWidgetData,
      color: undefined
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const containerElement = fixture.debugElement.query(By.css('.container'));
    expect(containerElement.styles['color']).toBe('inherit');
  });

  it('should apply custom text color when provided', () => {
    const newData = {
      ...mockWidgetData,
      color: 'red'
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const containerElement = fixture.debugElement.query(By.css('.container'));
    expect(containerElement.styles['color']).toBe('red');
  });

  it('should apply the correct icon color', () => {
    const newData = {
      ...mockWidgetData,
      color: 'blue'
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const buttonElement = fixture.debugElement.query(By.css('.settings-button'));
    expect(buttonElement.styles['--mdc-icon-button-icon-color']).toBe('blue');
  });

  it('should have correct grid area style based on rows and columns', () => {
    const newData = {
      ...mockWidgetData,
      rows: 2,
      columns: 3
    };
    (component as any).data.set(newData);
    fixture.detectChanges();
    
    const hostElement = fixture.debugElement.nativeElement;
    expect(hostElement.style.gridArea).toBe('span 2 / span 3');
  });

  it('should show options component when showOptions is true', () => {
    component.showOptions.set(true);
    fixture.detectChanges();
    
    const optionsComponent = fixture.debugElement.query(By.css('app-widget-options'));
    expect(optionsComponent).toBeTruthy();
  });

  it('should hide options component when showOptions is false', () => {
    component.showOptions.set(false);
    fixture.detectChanges();
    
    const optionsComponent = fixture.debugElement.query(By.css('app-widget-options'));
    expect(optionsComponent).toBeNull();
  });

  it('should have proper container styling', () => {
    const containerElement = fixture.debugElement.query(By.css('.container'));
    expect(containerElement.styles['position']).toBe('relative');
    expect(containerElement.styles['padding']).toBe('32px');
    expect(containerElement.styles['border-radius']).toBe('inherit');
  });

  it('should have proper settings button positioning', () => {
    const buttonElement = fixture.debugElement.query(By.css('.settings-button'));
    expect(buttonElement.styles['position']).toBe('absolute');
    expect(buttonElement.styles['top']).toBe('20px');
    expect(buttonElement.styles['right']).toBe('20px');
  });
});