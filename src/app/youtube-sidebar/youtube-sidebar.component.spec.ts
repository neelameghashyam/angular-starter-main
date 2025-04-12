import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeSidebarComponent } from './youtube-sidebar.component';

describe('YoutubeSidebarComponent', () => {
  let component: YoutubeSidebarComponent;
  let fixture: ComponentFixture<YoutubeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
