export class LoginlError extends Error {
    public constructor() {
        super("Invalid login");
    }
}