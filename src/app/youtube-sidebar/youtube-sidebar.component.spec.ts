import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YoutubeSidebarComponent } from './youtube-sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('YoutubeSidebarComponent', () => {
  let component: YoutubeSidebarComponent;
  let fixture: ComponentFixture<YoutubeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        YoutubeSidebarComponent, // Import standalone component here
        CustomSidenavComponent  // Also import if it's standalone
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YoutubeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('sidebar');
    expect(component.collapsed()).toBe(false);
  });

  it('should compute sidenavWidth correctly when collapsed', () => {
    component.collapsed.set(true);
    expect(component.sidenavWidth()).toBe('65px');
  });

  it('should compute sidenavWidth correctly when expanded', () => {
    component.collapsed.set(false);
    expect(component.sidenavWidth()).toBe('250px');
  });

  it('should toggle collapsed state when menu button is clicked', () => {
    const initialCollapsedState = component.collapsed();
    const menuButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    
    menuButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    expect(component.collapsed()).toBe(!initialCollapsedState);
  });

  it('should render mat-toolbar with menu button', () => {
    const toolbar = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbar).toBeTruthy();
    
    const menuButton = toolbar.query(By.css('button[mat-icon-button]'));
    expect(menuButton).toBeTruthy();
    
    const menuIcon = menuButton.query(By.css('mat-icon'));
    expect(menuIcon.nativeElement.textContent.trim()).toBe('menu');
  });

  it('should render mat-sidenav-container with correct structure', () => {
    const sidenavContainer = fixture.debugElement.query(By.css('mat-sidenav-container'));
    expect(sidenavContainer).toBeTruthy();
    
    const sidenav = sidenavContainer.query(By.css('mat-sidenav'));
    expect(sidenav).toBeTruthy();
    
    const sidenavContent = sidenavContainer.query(By.css('mat-sidenav-content'));
    expect(sidenavContent).toBeTruthy();
  });

  it('should pass collapsed state to CustomSidenavComponent', () => {
    const customSidenav = fixture.debugElement.query(By.directive(CustomSidenavComponent));
    expect(customSidenav).toBeTruthy();
    
    // Test initial state
    expect(customSidenav.componentInstance.collapsed).toBe(false);
    
    // Test after toggle
    component.collapsed.set(true);
    fixture.detectChanges();
    expect(customSidenav.componentInstance.collapsed).toBe(true);
  });

  it('should apply correct width styles based on collapsed state', () => {
    // Test expanded state
    component.collapsed.set(false);
    fixture.detectChanges();
    
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav'));
    expect(sidenav.styles['width']).toBe('250px');
    
    const sidenavContent = fixture.debugElement.query(By.css('mat-sidenav-content'));
    expect(sidenavContent.styles['margin-left']).toBe('250px');
    
    // Test collapsed state
    component.collapsed.set(true);
    fixture.detectChanges();
    
    expect(sidenav.styles['width']).toBe('65px');
    expect(sidenavContent.styles['margin-left']).toBe('65px');
  });

  it('should contain router-outlet in the sidenav content', () => {
    const routerOutlet = fixture.debugElement.query(By.css('mat-sidenav-content router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});