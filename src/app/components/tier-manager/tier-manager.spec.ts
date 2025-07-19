import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierManager } from './tier-manager';

describe('TierManager', () => {
  let component: TierManager;
  let fixture: ComponentFixture<TierManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TierManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
