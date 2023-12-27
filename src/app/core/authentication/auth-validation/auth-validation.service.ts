import { Injectable } from "@angular/core";
import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Middleware } from "./handler.model";
import { AlertValidator } from "./validations/alert.validator";
import { LicenseValidator } from "./validations/license.validator";
import { SettingsValidator } from "./validations/settings.validator";

@Injectable({
    providedIn: 'root'
})
export class AuthValidationService{

    public validateLogin(loginResponse: LoginResponse): Validators{
        const middlewares: Middleware = Middleware.link(
            new AlertValidator(),
            new LicenseValidator(),
            new SettingsValidator()
        )
        
        return middlewares.check(loginResponse);
    }

}

export enum Validators {
    HAS_ALERT,
    INVALID_LICENSE,
    INVALID_SETTINGS,
    VALID
}