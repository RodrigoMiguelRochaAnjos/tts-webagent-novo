import { AuthValidators } from "../auth-validation.service";
import { Middleware } from "../../../utils/middleware.structure";
import { LoginResponse } from "src/app/modules/home/models/login.response";

export class LicenseValidator extends Middleware<LoginResponse, AuthValidators> {

    public override check(loginResponse: LoginResponse): AuthValidators {

        if (!loginResponse.addOns?.WebAgent?.activeOnUser || !loginResponse.addOns?.WebAgent?.addOnGloballyActive){
            return AuthValidators.INVALID_LICENSE;
        }

        return this.checkNext(loginResponse);
    }

}