import { Validators } from "../auth-validation.service";
import { Middleware } from "../handler.model";
import { LoginResponse } from "src/app/modules/home/models/login.response";

export class LicenseValidator extends Middleware {

    public override check(loginResponse: LoginResponse): Validators {

        if (!loginResponse.addOns.WebAgent.activeOnUser || !loginResponse.addOns.WebAgent.addOnGloballyActive){
            return Validators.INVALID_LICENSE;
        }

        return this.checkNext(loginResponse);
    }

}