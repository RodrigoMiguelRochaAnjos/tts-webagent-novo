import { LoginResponse } from "src/app/modules/home/models/login.response";
import { AuthValidators } from "../auth-validation.service";
import { Middleware } from "../../../utils/middleware.structure";

export class RequestValidator extends Middleware<LoginResponse, AuthValidators> {

    public override check(loginResponse: LoginResponse): AuthValidators {
        if(!loginResponse.success) return AuthValidators.INVALID_REQUEST

        return this.checkNext(loginResponse);
    }

} 