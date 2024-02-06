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
import { PKey } from "src/app/modules/terminal/models/pkey.model";
import { Address } from "../models/user/contact/segments/address.model";
import { EnvironmentInjector, Injectable, Injector } from "@angular/core";
import { TerminalService } from "src/app/modules/terminal/data-access/terminal.service";
import { TerminalContent } from "src/app/modules/terminal/models/terminal-content.model";
import { SharedModule } from "src/app/shared/shared.module";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MenuService } from "src/app/modules/terminal/data-access/menu.service";
import { TerminalHistoryService } from "src/app/modules/terminal/data-access/terminal-history.service";
import { AlertService } from "../services/alert.service";
import { DestroyService } from "../services/destroy.service";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserMapper {


    mapLoginToUser(loginRequest: LoginRequest, response: LoginResponse) : User {

        let user: AuthenticatedUser = new AuthenticatedUser();


        if (!response.syncData.settings) {
            user = new IncompleteUser();
            user.settings = Settings.default();
            return user;
        }

        const phone: Phone = new Phone();

        phone.dialCode = response.syncData.settings.profileUserDialCode;
        phone.number = response.syncData.settings.profileUserPhone;

        const contact: Contact = new Contact();

        contact.email = response.syncData.settings.profileUserEmail;
        contact.phone = phone;

        if (response.syncData.settings.profileUserName) {
            const names: string[] = response.syncData.settings.profileUserName.split(" ");

            if (names.length === 1) {
                contact.firstName = names[0];
                contact.lastName = '';
            } else {
                contact.firstName = names[0];
                contact.lastName = names[names.length - 1];
            }
        }

        contact.entityName = response.syncData.settings.agencyEntityName;
        contact.address = new Address();
        contact.address.street = response.syncData.settings.street ? response.syncData.settings.street : ''; 
        contact.address.flat = response.syncData.settings.flat ? response.syncData.settings.flat : ''; 
        contact.address.locality = response.syncData.settings.locality ? response.syncData.settings.locality : ''; 
        contact.address.city = response.syncData.settings.city ? response.syncData.settings.city : ''; 
        contact.address.province = response.syncData.settings.province ? response.syncData.settings.province : ''; 
        contact.address.postCode = response.syncData.settings.postCode ? response.syncData.settings.postCode : ''; 
        contact.address.countryCode = response.syncData.settings.countryCode ? response.syncData.settings.countryCode : ''; 


        UserMapper.loadPKeysFromServer(response.syncData.pkeys);

        

        user.id = response.sessionId;
        user.token = response.token;
        user.name = response.syncData.settings.profileUserName;
        user.contact = contact;
        user.currency = 'EUR';
        user.languageCode = 'en';
        user.settings = response.syncData.settings;
        user.settings.message = response.message;

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

    private static loadPKeysFromServer(serverPKeys: any): void {
        const pkeys: PKey[] = [];
        serverPKeys.forEach((serverPKey: any) => {
            pkeys.push(PKey.fromServer(serverPKey));
        });
        localStorage.setItem('pkeys', JSON.stringify(pkeys));
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
        user.id = storedObject.data.id
        user.token = storedObject.data.token
        user.settings = Object.assign(new Settings(), JSON.parse(storedObject.data.settings));
        user.contact = Object.assign(new Contact(), JSON.parse(storedObject.data.contact));

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


        return user;
    }
}