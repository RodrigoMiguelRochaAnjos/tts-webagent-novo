import { AuthValidators } from "../auth-validation.service";
import { Middleware } from "../../../utils/middleware.structure";
import { LoginResponse } from "src/app/modules/home/models/login.response";

export class AlertValidator extends Middleware<LoginResponse, AuthValidators> {

    public override check(loginResponse: LoginResponse): AuthValidators {

        if (loginResponse.licenseAlert && loginResponse.licenseAlert.length > 0) {
            return AuthValidators.HAS_ALERT;
        }

        return this.checkNext(loginResponse);
    }

}