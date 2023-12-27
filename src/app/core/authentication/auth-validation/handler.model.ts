import { LoginResponse } from "src/app/modules/home/models/login.response";
import { Validators } from "./auth-validation.service";

export abstract class Middleware {
    public failedValidator?: Validators;
    private next?: Middleware;

    public static link(first: Middleware, ...chain: Middleware[]): Middleware {
        let head: Middleware = first;

        for(let nextInChain of chain) {
            head.next = nextInChain;
            head = nextInChain;
        }

        return first;
    }

    public abstract check(loginResponse: LoginResponse): Validators;

    protected checkNext(loginResponse: LoginResponse): Validators {
        if (this.next == null) {
            return Validators.VALID;
        }

        return this.next.check(loginResponse);
    }

}