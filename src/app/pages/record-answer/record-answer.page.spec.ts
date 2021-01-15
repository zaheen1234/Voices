import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecordAnswerPage } from './record-answer.page';

describe('RecordAnswerPage', () => {
  let component: RecordAnswerPage;
  let fixture: ComponentFixture<RecordAnswerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAnswerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordAnswerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
