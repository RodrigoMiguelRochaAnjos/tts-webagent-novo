import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { DebugElement } from '@angular/core';
import { AppModule } from './app.module';
import { KeepAliveService } from './core/authentication/keep-alive.service';
import { AuthService } from './core/authentication/auth.service';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'tts-webagent-web'`, () => {
        expect(component.title).toEqual('tts-webagent-web');
    });
});
