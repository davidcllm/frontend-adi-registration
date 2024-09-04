import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreRegistrationsComponent } from './user-pre-registrations.component';

describe('UserPreRegistrationsComponent', () => {
  let component: UserPreRegistrationsComponent;
  let fixture: ComponentFixture<UserPreRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPreRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPreRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
