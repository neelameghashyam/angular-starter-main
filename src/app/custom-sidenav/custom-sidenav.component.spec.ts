import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSidenavComponent } from './custom-sidenav.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatNavListHarness } from '@angular/material/list/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { Router } from '@angular/router';

describe('CustomSidenavComponent', () => {
  let component: CustomSidenavComponent;
  let fixture: ComponentFixture<CustomSidenavComponent>;
  let loader: HarnessLoader;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: CustomSidenavComponent }
        ])
      ],
      declarations: [CustomSidenavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSidenavComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default menu items', () => {
    expect(component.menuItems().length).toBe(4);
    expect(component.menuItems()[0].label).toBe('Dashboard');
    expect(component.menuItems()[1].icon).toBe('video_library');
  });

  it('should initialize with sideNavCollapsed as false', () => {
    expect(component.sideNavCollapsed()).toBe(false);
  });

  it('should update sideNavCollapsed when input changes', () => {
    component.collapsed = true;
    fixture.detectChanges();
    expect(component.sideNavCollapsed()).toBe(true);
  });

  it('should calculate profilePicSize based on collapsed state', () => {
    expect(component.profilePicSize()).toBe('100');
    component.collapsed = true;
    fixture.detectChanges();
    expect(component.profilePicSize()).toBe('32');
  });

  it('should render all menu items', async () => {
    const navList = await loader.getHarness(MatNavListHarness);
    const items = await navList.getItems();
    expect(items.length).toBe(4);
  });

  it('should show/hide header text based on collapsed state', () => {
    // Not collapsed - should show text
    let headerText = fixture.debugElement.query(By.css('.header-text'));
    expect(headerText.nativeElement.classList.contains('hide-header-text')).toBe(false);

    // Collapsed - should hide text
    component.collapsed = true;
    fixture.detectChanges();
    headerText = fixture.debugElement.query(By.css('.header-text'));
    expect(headerText.nativeElement.classList.contains('hide-header-text')).toBe(true);
  });

  it('should show/hide menu item labels based on collapsed state', async () => {
    // Not collapsed - should show labels
    let spans = fixture.debugElement.queryAll(By.css('span[matListItemTitle]'));
    expect(spans.length).toBe(4);

    // Collapsed - should hide labels
    component.collapsed = true;
    fixture.detectChanges();
    spans = fixture.debugElement.queryAll(By.css('span[matListItemTitle]'));
    expect(spans.length).toBe(0);
  });

  it('should change icon when active', async () => {
    // Navigate to dashboard to activate the first menu item
    await router.navigate(['/dashboard']);
    fixture.detectChanges();

    const icons = await loader.getAllHarnesses(MatIconHarness);
    const firstIcon = icons[0];
    expect(await firstIcon.getName()).toBe('dashboard');
  });

  it('should apply selected styles to active menu item', async () => {
    // Navigate to dashboard to activate the first menu item
    await router.navigate(['/dashboard']);
    fixture.detectChanges();

    const firstMenuItem = fixture.debugElement.query(By.css('.menu-item'));
    expect(firstMenuItem.nativeElement.classList.contains('selected-menu-item')).toBe(true);

    // Other items should not have selected class
    const otherItems = fixture.debugElement.queryAll(By.css('.menu-item:not(.selected-menu-item)'));
    expect(otherItems.length).toBe(3);
  });

  it('should render profile picture with correct size', () => {
    // Not collapsed - large size
    let img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.width).toBe(100);
    expect(img.nativeElement.height).toBe(100);

    // Collapsed - small size
    component.collapsed = true;
    fixture.detectChanges();
    img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.width).toBe(32);
    expect(img.nativeElement.height).toBe(32);
  });

  it('should have proper border and background for active item', async () => {
    await router.navigate(['/dashboard']);
    fixture.detectChanges();

    const activeItem = fixture.debugElement.query(By.css('.selected-menu-item'));
    const styles = getComputedStyle(activeItem.nativeElement);
    expect(styles.borderLeftColor).toBe('rgb(0, 0, 0)');
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('should have no border for inactive items', () => {
    const inactiveItems = fixture.debugElement.queryAll(By.css('.menu-item:not(.selected-menu-item)'));
    inactiveItems.forEach(item => {
      const styles = getComputedStyle(item.nativeElement);
      expect(styles.borderLeftColor).toBe('rgba(0, 0, 0, 0)');
    });
  });
});