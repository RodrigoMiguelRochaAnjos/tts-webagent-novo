export class HasAlertError extends Error {
    constructor() {
        super("Your account has an alert");
    }
}