import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Validators } from "../auth-validation.service";
import { Middleware } from "../handler.model";

export class RequestValidator extends Middleware {

    public override check(loginResponse: LoginResponse): Validators {
        if(!loginResponse.success) return Validators.INVALID_REQUEST

        return this.checkNext(loginResponse);
    }

} 