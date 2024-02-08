// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { BehaviorSubject, Subscribable } from "rxjs";
// import { IpInformation } from "src/app/modules/home/feature/home-page/home-page.component";

// @Injectable({
//     providedIn: 'root'
// })
// export class LogService {

//     private ipInformation: BehaviorSubject<IpInformation> = new BehaviorSubject<IpInformation>(new IpInformation());

//     constructor(private httpClient: HttpClient) {}

//     public registerLogin() {
//         this.httpClient.get<IpInformation>("http://ip-api.com/json").subscribe({
//             next: (info: IpInformation) => {
//                 this.ipInformation.next(info);
//             },
//             error: (error: any) => {
//             }
//         })
//     }

//     public getIpInformation() : Subscribable<IpInformation> {
//         return this.ipInformation;
//     }
// }