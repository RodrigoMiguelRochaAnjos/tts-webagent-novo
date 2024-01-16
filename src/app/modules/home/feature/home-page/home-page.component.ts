import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Galileo } from 'src/app/core/models/gds/types/galileo.model';
import { LoginRequest } from 'src/app/core/models/requests/login-request.model';
import { User } from 'src/app/core/models/user/user.model';
import { InputType } from 'src/app/shared/ui/inputs/input-type.enum';
import { Theme } from 'src/app/shared/ui/inputs/theme.enum';

export class IpInformation{
    query!: string;
    status!: string;
    country!: string;
    countryCode!: string;
    region!: string;
    regionName!: string;
    city!: string;
    zip!: string;
    lat!: number;
    lon!: number;
    timezone!: string;
    isp!: string;
    org!: string;
    as!: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit{
    
    InputType = InputType;
    Theme = Theme;
    public user$!: Observable<User>;
    loginRequest!: LoginRequest;
    
    switch: { [key: string]: boolean} = {
        'Apollo': false,
        'Galileo': true,
        'Worldspan': false
    }

    constructor(
        private authService: AuthService,
    ) {  }

    ngOnInit(): void {
        this.loginRequest = new LoginRequest();
        this.user$ = this.authService.getUser();

        this.loginRequest.platform = window.navigator.userAgent;
        this.loginRequest.platformVersion = "4.0.1";
        this.loginRequest.product = "WebAgent";
    }

    login() : void {
        let selectedGds: string | undefined = Object.keys(this.switch).find(key => this.switch[key] === true);;

        console.log(selectedGds);

        this.loginRequest.gds = selectedGds ? selectedGds : 'Galileo';
        
        if(!this.loginRequest.isValid()) return;

        this.authService.login(this.loginRequest);
    }
}
