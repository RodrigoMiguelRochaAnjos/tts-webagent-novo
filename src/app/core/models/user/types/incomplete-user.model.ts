import { User } from "../user.model";
import { AuthenticatedUser } from "./authenticated-user.model";

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

    public copy(user: User): IncompleteUser {
        if (!(user instanceof AuthenticatedUser || user instanceof IncompleteUser)) return this;

        this.id = user.id;
        this.token = user.token;
        this.name = user.name;
        this.languageCode = user.languageCode;
        this.currency = user.currency;
        this.contact = user.contact;
        this.settings = user.settings;
        this.gds = user.gds;

        return this;
    }
}