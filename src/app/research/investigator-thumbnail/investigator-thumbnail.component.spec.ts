import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorThumbnailComponent } from './investigator-thumbnail.component';

describe('InvestigatorThumbnailComponent', () => {
  let component: InvestigatorThumbnailComponent;
  let fixture: ComponentFixture<InvestigatorThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorThumbnailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
