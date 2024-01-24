import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { LoadingComponent } from './shared/ui/loading/loading.component';
import { CommonModule } from '@angular/common';
import { WebagentInputComponent } from './shared/ui/inputs/webagent-input/webagent-input.component';
import { SharedModule } from './shared/shared.module';
import { FlightSearchFormComponent } from './modules/neo/features/search/ui/flight-search-form/flight-search-form.component';
import { FormsModule } from '@angular/forms';

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
        FormsModule,
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
