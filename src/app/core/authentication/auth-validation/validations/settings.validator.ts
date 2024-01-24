import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Middleware } from "../handler.model";
import { Validators } from "../auth-validation.service";

export class SettingsValidator extends Middleware {

    public override check(loginResponse: LoginResponse): Validators {
        if (loginResponse.syncData == null) return Validators.INVALID_SETTINGS;
        if (loginResponse.syncData.settings == null) return Validators.INVALID_SETTINGS;
        if(!loginResponse.syncData.settings.isValid()) return Validators.INVALID_SETTINGS;

        return this.checkNext(loginResponse);
    }

}