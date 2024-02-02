import { AuthValidators } from "../authentication/auth-validation/auth-validation.service";

export abstract class Middleware<T, V> {
    public failedValidator?: AuthValidators;
    private next?: Middleware<T, V>;

    public static link(first: Middleware<any, any>, ...chain: Middleware<any, any>[]): Middleware<any, any> {
        let head: Middleware<any, any> = first;

        for(let nextInChain of chain) {
            head.next = nextInChain;
            head = nextInChain;
        }

        return first;
    }

    public abstract check(next: T): V;

    protected checkNext(next: T): V {
        if (this.next == null) {
            return 0 as V;
        }

        return this.next.check(next);
    }

} 

