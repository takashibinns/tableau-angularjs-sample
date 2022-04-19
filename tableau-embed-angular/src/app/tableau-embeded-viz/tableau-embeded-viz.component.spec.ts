import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauEmbededVizComponent } from './tableau-embeded-viz.component';

describe('TableauEmbededVizComponent', () => {
  let component: TableauEmbededVizComponent;
  let fixture: ComponentFixture<TableauEmbededVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauEmbededVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauEmbededVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
