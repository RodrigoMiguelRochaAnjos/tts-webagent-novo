import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Middleware } from "../../../utils/middleware.structure";
import { AuthValidators } from "../auth-validation.service";

export class SettingsValidator extends Middleware<LoginResponse, AuthValidators>  {

    public override check(loginResponse: LoginResponse): AuthValidators {
        if(!loginResponse.syncData.settings.isValid()) return AuthValidators.INVALID_SETTINGS;

        return this.checkNext(loginResponse);
    }

}