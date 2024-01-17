import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Information } from "../models/information.model";

@Injectable({
    providedIn: 'root'
})
export class InformationService {
    private readonly ENDPOINT: string = environment.endpoints.INFORMATION;
    private readonly HEADERS: HttpHeaders = new HttpHeaders().set('Accept', 'application/json, text/plain, */*').set('Origin', window.location.origin);

    constructor(private restService: HttpClient, private httpClient: HttpClient) { }

    getInformations(codes: string): Promise<Information[]> {

        return new Promise<Information[]>((resolve) => {
            this.restService.get<Information[]>(this.ENDPOINT, { params: { 'ids': codes } }).subscribe({
                next: (result: Information[]) => {
                    const informations = new Array<Information>();

                    result.forEach((info) => {
                        informations.push(Information.fromServer(info));
                    });
                    resolve(informations);
                },
                error: (error: HttpErrorResponse) => {
                    alert(`Error, ${error.message}`);
                }
            })

        });
    }
}