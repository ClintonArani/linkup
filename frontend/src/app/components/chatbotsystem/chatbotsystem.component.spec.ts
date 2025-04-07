import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotsystemComponent } from './chatbotsystem.component';

describe('ChatbotsystemComponent', () => {
  let component: ChatbotsystemComponent;
  let fixture: ComponentFixture<ChatbotsystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotsystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
