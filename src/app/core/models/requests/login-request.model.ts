export class LoginRequest {
    son!: string;
    pcc!: string;
    pwd!: string;
    gds!: string;
    platform!: string;
    platformVersion!: string;
    product!: string;

    public isValid(): boolean {
        return (
            this.son != null && this.son != "" &&
            this.pcc != null && this.pcc != "" &&
            this.pwd != null && this.pwd != "" &&
            this.gds != null && this.gds != "" &&
            this.platform != null && this.platform != "" &&
            this.platformVersion != null && this.platformVersion != "" &&
            this.product != null && this.product != ""
        );
    }
}