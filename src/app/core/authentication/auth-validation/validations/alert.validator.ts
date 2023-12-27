import { Validators } from "../auth-validation.service";
import { Middleware } from "../handler.model";
import { LoginResponse } from "src/app/modules/home/models/login.response";

export class AlertValidator extends Middleware {

    public override check(loginResponse: LoginResponse): Validators {

        if (loginResponse.licenseAlert && loginResponse.licenseAlert.length > 0) {
            return Validators.HAS_ALERT;
        }

        return this.checkNext(loginResponse);
    }

}