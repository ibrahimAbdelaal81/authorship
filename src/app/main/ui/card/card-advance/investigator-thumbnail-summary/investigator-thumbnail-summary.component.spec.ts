import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorThumbnailSummaryComponent } from './investigator-thumbnail-summary.component';

describe('InvestigatorThumbnailSummaryComponent', () => {
  let component: InvestigatorThumbnailSummaryComponent;
  let fixture: ComponentFixture<InvestigatorThumbnailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorThumbnailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorThumbnailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
