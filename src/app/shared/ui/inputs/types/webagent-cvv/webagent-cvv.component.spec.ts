import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebagentCvvComponent } from './webagent-cvv.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('WebagentCvvComponent', () => {
let component: WebagentCvvComponent;
let fixture: ComponentFixture<WebagentCvvComponent>;

beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ WebagentCvvComponent ],
    imports: [FormsModule, ReactiveFormsModule]

    })
    .compileComponents();

    fixture = TestBed.createComponent(WebagentCvvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

it('should create', () => {
    expect(component).toBeTruthy();
});


it('should mark the form as invalid for a non-numeric input (abc)', () => {

    component.cvvForm.controls['cvv'].setValue('abc');

    fixture.detectChanges();

    expect(component.cvvForm.invalid).toBeTruthy();
});


it('should mark the form as invalid for a CVV with the minimum allowed length (less than 3 digits)', () => {

    component.cvvForm.controls['cvv'].setValue('12');

    fixture.detectChanges();

    expect(component.cvvForm.invalid).toBeTruthy();
});

it('should mark the form as valid for a CVV with exactly 3 digits', () => {

    component.cvvForm.controls['cvv'].setValue('123');

    fixture.detectChanges();

    expect(component.cvvForm.valid).toBeTruthy();
});

it('should mark the form as valid for a CVV with exactly 5 digits (maximum allowed length)', () => {

    component.cvvForm.controls['cvv'].setValue('12345');

    fixture.detectChanges();

    expect(component.cvvForm.valid).toBeTruthy();
});

it('should mark the form as invalid for a CVV with more than 5 digits (greater than maximum allowed length)', () => {

    component.cvvForm.controls['cvv'].setValue('123456');

    fixture.detectChanges();

    expect(component.cvvForm.invalid).toBeTruthy();
});
});