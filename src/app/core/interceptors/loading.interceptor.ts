import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, finalize } from "rxjs";
import { LoadingService } from "./loading.service";
import { Injectable } from "@angular/core";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    private totalRequests = 0;

    constructor(
        private loadingService:LoadingService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get("skip")) return next.handle(req);
        this.totalRequests++;
        this.loadingService.show();

        return next.handle(req).pipe(
            finalize(() => {
                this.totalRequests--;

                if(this.totalRequests == 0) this.loadingService.dismiss();
            })
        )
    }

}