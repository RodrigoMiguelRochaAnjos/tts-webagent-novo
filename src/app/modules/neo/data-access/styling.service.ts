import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StylingService {

    public loadScssFile(path: string): void {
        const link: HTMLLinkElement = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        document.head.appendChild(link);
    }
}