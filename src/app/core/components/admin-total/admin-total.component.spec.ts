import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTotalComponent } from './admin-total.component';

describe('AdminTotalComponent', () => {
  let component: AdminTotalComponent;
  let fixture: ComponentFixture<AdminTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
