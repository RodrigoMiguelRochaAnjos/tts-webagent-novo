import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Middleware } from "../../../utils/middleware.structure";
import { AuthValidators } from "../auth-validation.service";

export class NoSettingsValidator extends Middleware<LoginResponse, AuthValidators>{

    public override check(loginResponse: LoginResponse): AuthValidators {
        if (loginResponse.syncData == null) return AuthValidators.NO_SETTINGS;
        if (loginResponse.syncData.settings == null) return AuthValidators.NO_SETTINGS;

        return this.checkNext(loginResponse);
    }

} 