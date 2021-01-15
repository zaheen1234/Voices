import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnswerRecordedPage } from './answer-recorded.page';

describe('AnswerRecordedPage', () => {
  let component: AnswerRecordedPage;
  let fixture: ComponentFixture<AnswerRecordedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerRecordedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerRecordedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
