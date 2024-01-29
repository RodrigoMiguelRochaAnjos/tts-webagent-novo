import { LoginResponse } from "src/app/modules/home/models/login.response";
import { User } from "../models/user/user.model";
import { Apollo } from "../models/gds/types/apollo.model";
import { Galileo } from "../models/gds/types/galileo.model";
import { Worldspan } from "../models/gds/types/worldspan.model";
import { LoginRequest } from "../models/requests/login-request.model";
import { Contact } from "../models/user/contact/contact.model";
import { Phone } from "../models/user/contact/segments/phone.model";
import { AuthenticatedUser } from "../models/user/types/authenticated-user.model";
import { IncompleteUser } from "../models/user/types/incomplete-user.model";
import { AnonymousUser } from "../models/user/types/anonymous-user.model";
import { Settings } from "src/app/modules/home/models/settings.model";

export class UserMapper {
    static mapLoginToUser(loginRequest: LoginRequest, response: LoginResponse) : User {
        const phone: Phone = new Phone();

        phone.dialCode = response.syncData.settings.profileUserDialCode;
        phone.number = response.syncData.settings.profileUserPhone;

        const contact: Contact = new Contact();

        contact.email = response.syncData.settings.profileUserEmail;
        contact.phone = phone;

        let user: AuthenticatedUser;
        user = new AuthenticatedUser()

        if (!response.syncData.settings) {
            user = new IncompleteUser();
            user.settings = Settings.default();
            return user;
        }

        user.id = response.sessionId;
        user.token = response.token;
        user.name = response.syncData.settings.profileUserName;
        user.contact = contact;
        user.currency = 'EUR';
        user.languageCode = 'en';
        user.settings = response.syncData.settings;

        switch (loginRequest.gds) {
            case 'Galileo':
                user.gds = new Galileo();
                break;
            case 'Apollo':
                user.gds = new Apollo();
                break;
            case 'Worldspan':
                user.gds = new Worldspan();
                break;
            default: throw new Error('Invalid GDS');
        }
        user.gds.pcc = loginRequest.pcc;
        user.gds.son = loginRequest.son;

        return user;
    }

    static mapStorageToUser(obj: string | null): User {
        if(obj == null) {
            return new AnonymousUser();
        }

        const storedObject: any = JSON.parse(obj);

        if (storedObject.type == 'AnonymousUser' || storedObject.type != 'AuthenticatedUser') {
            return new AnonymousUser();
        }

        const user: AuthenticatedUser = new AuthenticatedUser();

        user.name = storedObject.data.name
        user.languageCode = storedObject.data.languageCode
        user.currency = storedObject.data.currency
        user.contact = storedObject.data.contact
        user.id = storedObject.data.id
        user.token = storedObject.data.token
        console.log("Stored object: ",storedObject.data.settings);
        user.settings = Object.assign(new Settings(), JSON.parse(storedObject.data.settings));

        switch (storedObject.data.gds) {
            case 'Galileo':
                user.gds = new Galileo();
                break;
            case 'Apollo':
                user.gds = new Apollo();
                break;
            case 'Worldspan':
                user.gds = new Worldspan();
                break;
            default:
                throw new Error('Invalid GDS');
        }

        user.gds = user.gds.load();

        user.contact = new Contact();
        user.contact.load();


        return user;
    }
}