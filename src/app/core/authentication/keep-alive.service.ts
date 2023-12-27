import { Injectable, EventEmitter } from "@angular/core";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, skip } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

/**
 * Keep-alive service
 *
 * service responsible for checking whether the session of the user is still valid or not
 */
@Injectable({
    providedIn: 'root'
})
export class KeepAliveService {

    private readonly ENDPOINT = `${environment.endpoints.TMA}/KeepAlive`;

    /**
     * Event emitter classes can subscribe to check the validity of the session
     *
     * emits a boolean false when the session has expired
     */
    private keepAliveValidity$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    // property that holds the Interval for the keep-alive request
    private keepAliveIntervalId!: ReturnType<typeof setInterval>;

    constructor(
        private restService: HttpClient
    ) {
    }

    /**
     * Starts the keep-alive interval
     * Emits an event regarding the session state every (@property keepAliveInterval) milliseconds
     *
     * @param sessionId the session id to verify
     */
    start(sessionId: string): void {
        
        // keep checking session
        this.keepAliveIntervalId = setInterval(() => {
            this.checkSession(sessionId).subscribe({
                    next: (result) => {
                        if (result) {
                            this.keepAliveValidity$.next(result.status);
                            return;
                        }

                        this.keepAliveValidity$.next(false);
                    }
            });
        }, 30000);
    }

    public getSessionStatus(): Observable<boolean> {
        return this.keepAliveValidity$;
    }

    /**
     * Stops the keep-alive interval
     */
    stop(): void {
        clearInterval(this.keepAliveIntervalId);
    }

    /**
     * Sends the keep-alive request to the
     * (@property baseApiUrl) API
     *
     * @param postData the object to be sent to the API
     * @returns a promise with the Result from the API
     */
    public checkSession(sessionId: string): Observable<any> {
        const postData = {sessionId};
        return this.restService.post(this.ENDPOINT, postData);
    }
}
