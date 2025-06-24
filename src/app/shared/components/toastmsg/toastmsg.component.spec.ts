import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastmsgComponent } from './toastmsg.component';

describe('ToastmsgComponent', () => {
  let component: ToastmsgComponent;
  let fixture: ComponentFixture<ToastmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastmsgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
