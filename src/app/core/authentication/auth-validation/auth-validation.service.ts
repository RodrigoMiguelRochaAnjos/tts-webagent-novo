import { Injectable } from "@angular/core";
import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Middleware } from "./handler.model";
import { AlertValidator } from "./validations/alert.validator";
import { LicenseValidator } from "./validations/license.validator";
import { SettingsValidator } from "./validations/settings.validator";
import { RequestValidator } from "./validations/request.validator";
import { NoSettingsValidator } from "./validations/no-settings.validator";

@Injectable({
    providedIn: 'root'
})
export class AuthValidationService{

    public validateLogin(loginResponse: LoginResponse): Validators{
        const middlewares: Middleware = Middleware.link(
            new RequestValidator(),
            new AlertValidator(),
            new LicenseValidator(),
            new NoSettingsValidator(),
            new SettingsValidator(),
        )
        
        return middlewares.check(loginResponse);
    }

}

export enum Validators {
    HAS_ALERT,
    INVALID_LICENSE,
    INVALID_SETTINGS,
    NO_SETTINGS,
    INVALID_REQUEST,
    VALID
}