import { User } from "../user.model";

export class IncompleteUser extends User {
    public id!: string;
    public token!: string;

    public override save(): void {
        return;
    }

    public setId(id: string): this {
        this.id = id;
        return this;
    }

    public setToken(token: string): this {
        this.token = token;
        return this;
    }
}