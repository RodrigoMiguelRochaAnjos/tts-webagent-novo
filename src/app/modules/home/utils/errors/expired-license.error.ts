export class ExpiredLicenseError extends Error{
    constructor() {
        super("License is expired");
    }
}