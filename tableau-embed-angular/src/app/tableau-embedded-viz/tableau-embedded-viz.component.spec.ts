import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauEmbeddedVizComponent } from './tableau-embedded-viz.component';

describe('TableauEmbeddedVizComponent', () => {
  let component: TableauEmbeddedVizComponent;
  let fixture: ComponentFixture<TableauEmbeddedVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauEmbeddedVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauEmbeddedVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
