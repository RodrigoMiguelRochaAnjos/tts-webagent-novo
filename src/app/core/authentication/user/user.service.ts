import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginRequest } from "../../models/requests/login-request.model";
import { environment } from "src/environments/environment";
import { LoginResponse } from "src/app/modules/home/models/login.response";
import { LogoutRequest } from "../../models/requests/logout-request.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly ENDPOINT = environment.endpoints.TMA;

    constructor(private httpClient: HttpClient) {}

    login(body: LoginRequest): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(`${this.ENDPOINT}/Login`, body);
    }

    logout(body: LogoutRequest) : Observable<any> {
        return this.httpClient.post<any>(`${this.ENDPOINT}/SignOff`, body);
    }
}