import { User } from "../user.model";
import { Worldspan } from "../../gds/types/worldspan.model";
import { Galileo } from "../../gds/types/galileo.model";
import { Apollo } from "../../gds/types/apollo.model";
import { Contact } from "../contact/contact.model";
import { AnonymousUser } from "./anonymous-user.model";

export class AuthenticatedUser extends User {
    public id!: string;
    public token!: string;

    public override save(): void {
        if(!this.isValid()) {
            throw new Error("Invalid user");
        }
        
        const user: string = JSON.stringify({
            type: "AuthenticatedUser",
            data: {
                id: this.id,
                name: this.name,
                languageCode: this.languageCode,
                currency: this.currency,
                gds: this.gds.toString(),
                token: this.token
            }
        });

        this.contact.save();
        this.gds.save();

        localStorage.removeItem("user");
        localStorage.setItem("user", user);
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