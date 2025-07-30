import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopGenresChartComponent } from './top-genres-chart';

describe('TopGenresChart', () => {
  let component: TopGenresChartComponent;
  let fixture: ComponentFixture<TopGenresChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopGenresChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopGenresChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
