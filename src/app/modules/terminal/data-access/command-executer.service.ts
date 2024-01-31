import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { TerminalCommandRequest } from "../models/terminal-command/terminal-command-request.model";
import { TerminalCommandResponse } from "../models/terminal-command/terminal-command.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { DestroyService } from "src/app/core/services/destroy.service";
import { AlertService } from "src/app/core/services/alert.service";
import { AlertType } from "src/app/shared/ui/alerts/alert-type.enum";

@Injectable({
    providedIn: 'root'
})
export class CommandExecuterService {
    private readonly ENDPOINT: string = environment.endpoints.TMA;
    
    private command$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private httpClient: HttpClient,
        private destroyService: DestroyService,
        private alertService: AlertService
    ) {}

    public execute(command: TerminalCommandRequest) {
        this.httpClient.post<any>(`${this.ENDPOINT}/TerminalCommand`, command).subscribe({
            next: (value: any) => this.command$.next(value),
            error: () => {
                this.command$.next(null)
                this.alertService.show(AlertType.ERROR, "Command error")
            }
        })
    }

    public getCommand(): Observable<TerminalCommandResponse> {
        return this.command$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }
}