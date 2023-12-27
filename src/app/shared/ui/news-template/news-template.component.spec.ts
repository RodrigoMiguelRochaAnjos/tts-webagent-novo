import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTemplateComponent } from './news-template.component';
import { By } from '@angular/platform-browser';

describe('NewsTemplateComponent', () => {
    let component: NewsTemplateComponent;
    let fixture: ComponentFixture<NewsTemplateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewsTemplateComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NewsTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('template: news', () => {
        it('should render the title to the screen', ()=> {
            const testData: string = "";
            component.title = testData;

            fixture.detectChanges();

            const titleElement = fixture.debugElement.query(By.css('[data-testid="title"]'));

            expect(titleElement).toBeTruthy();
        })
    })
});
