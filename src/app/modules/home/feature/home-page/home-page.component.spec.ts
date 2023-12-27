import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HomePageModule } from './module/home-page.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { KeepAliveService } from 'src/app/core/authentication/keep-alive.service';
import { AppModule } from 'src/app/app.module';
import { LoginRequest } from 'src/app/core/models/requests/login-request.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let de: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HomePageModule, AppModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('logic', () => {
        describe('login request', () => {
            let loginRequest: LoginRequest;

            it('should be initialized',() => {
                loginRequest = new LoginRequest();

                component.loginRequest = loginRequest;

                expect(component.loginRequest != null).toBeTruthy()
            })

            it('login request should not accept empty strings as fields', () => {
                component.loginRequest = new LoginRequest();
                component.loginRequest.son = ""
                component.loginRequest.pcc = ""
                component.loginRequest.pwd = ""
                component.loginRequest.gds = ""
                component.loginRequest.platform = ""
                component.loginRequest.platformVersion = ""
                component.loginRequest.product = ""
        
                expect(component.loginRequest.isValid()).toBeFalsy();
            })
        
            it('login request should not accept undefined fields', () => {
                component.loginRequest = new LoginRequest();
        
                expect(component.loginRequest.isValid()).toBeFalsy();
            })
        })
    })
    describe('dom', () => {
        describe('gds option', () => {
            it('should call selectGDS() when an option is clicked', () => {
                spyOn(component, 'selectGDS');
                const gdsOptions = de.nativeElement.querySelectorAll('.option');
                
                gdsOptions[0].click();
                gdsOptions[1].click();
                gdsOptions[2].click();

                expect(component.selectGDS).toHaveBeenCalledTimes(3);
                expect(component.selectGDS).toHaveBeenCalledWith('Galileo');
                expect(component.selectGDS).toHaveBeenCalledWith('Apollo');
                expect(component.selectGDS).toHaveBeenCalledWith('Worldspan');
            });
        })
        describe('field', () => {
            it('should exist', () => {
                expect(de.queryAll(By.css('.field')).length).toBeGreaterThan(0);
            })
            describe('label', () => {
                it('should exist', () => {
                    expect(de.queryAll(By.css('.field label')).length).toBe(de.queryAll(By.css('.field')).length)
                })
                it('should have text', () => {
                    de.queryAll(By.css('.field label')).forEach((value: DebugElement, index: number) => {
                        expect(value.nativeElement.innerText).not.toBe("");
                    })
                })

            })
            describe('input', () => {
                it('should update loginRequest when a user enters values', () => {
                    const sonInput = de.query(By.css('.field.son input')).nativeElement;

                    sonInput.value = '123';
                    sonInput.dispatchEvent(new Event('input'));

                    const pwdInput = de.query(By.css('.field.password input')).nativeElement;

                    pwdInput.value = '123';
                    pwdInput.dispatchEvent(new Event('input'));

                    const pccInput = de.query(By.css('.field.pcc input')).nativeElement;

                    pccInput.value = '123';
                    pccInput.dispatchEvent(new Event('input'));

                    expect(component.loginRequest.son).toEqual('123');
                    expect(component.loginRequest.pwd).toEqual('123');
                    expect(component.loginRequest.pcc).toEqual('123');
                });
            })
        })
        describe('submit button', () => {
            it('should exist', () => {
                expect(de.query(By.css("button.submit"))).toBeTruthy()
            })
            it('should try to login when clicked', () => {
                spyOn(component, 'login');
                
                const loginButton: HTMLButtonElement = de.query(By.css("button.submit")).nativeElement;

                loginButton.click();

                expect(component.login).toHaveBeenCalled()
            })
        })
    })
});
