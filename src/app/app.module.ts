import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { LoadingComponent } from './shared/ui/loading/loading.component';
import { CommonModule } from '@angular/common';
import { NeoDatePickerComponent } from './modules/neo/ui/neo-date-picker/neo-date-picker.component';
import { WebagentInputComponent } from './shared/ui/inputs/webagent-input/webagent-input.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        NavbarComponent,
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
