import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTicketPage } from './add-ticket.page';

describe('AddTicketPage', () => {
  let component: AddTicketPage;
  let fixture: ComponentFixture<AddTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
