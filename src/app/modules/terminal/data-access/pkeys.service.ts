import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/core/services/destroy.service';
import { PKey } from '../models/pkey.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { User } from 'src/app/core/models/user/user.model';
import { AuthenticatedUser } from 'src/app/core/models/user/types/authenticated-user.model';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { AlertType } from 'src/app/shared/ui/alerts/alert-type.enum';

@Injectable({
    providedIn: 'root'
})
export class PkeysService {
    private readonly ENDPOINT: string = environment.endpoints.TMA;
    private messages: { [key: string]: string } = {
        ERROR: '',
        PKEY_LABEL: '',
        INVALID: '',
    }

    private pkeys$: BehaviorSubject<PKey[]> = new BehaviorSubject<PKey[]>([]);

    constructor(
        private restService: HttpClient,
        private authService: AuthService,
        private alertService: AlertService,
        private destroyService: DestroyService,
        translate: TranslateService
    ) {
        this.loadPkeysFromStorage();

        Object.keys(this.messages).forEach((key: string) => {
            translate.stream(key).pipe(takeUntil(this.destroyService.getDestroyOrder())).subscribe((text: string) => this.messages[key] = text);
        });
    }

    public getPkeys(): Observable<PKey[]> {
        return this.pkeys$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    private save(newPKeys: PKey[]): void {
        localStorage.setItem('pkeys', JSON.stringify(newPKeys));
        this.pkeys$.next(newPKeys);
    }

    public get(index: number): PKey {
        return this.pkeys$.value[index];
    }

    public add(newPKey: PKey): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (!newPKey.isValid()) {
                this.alertService.show(AlertType.ERROR, this.messages['INVALID'] + " " + this.messages['PKEY_LABEL']);
                resolve(false);
                return;
            }
            this.authService.getUser().subscribe((user: User) => {
                if (!(user instanceof AuthenticatedUser)) return;

                const postData = { sessionId: user.id, pkey: newPKey.toPostData() };

                this.restService.post(`${this.ENDPOINT}/CreateUpdatePKey`, postData).subscribe({
                    next: (result: any) => {
                        const pkeys = this.pkeys$.value;
                        pkeys.push(newPKey);

                        this.save(pkeys);

                        resolve(true);
                    },
                    error: (err: Error) => {
                        this.alertService.show(AlertType.ERROR, this.messages['INVALID'] + " " + this.messages['PKEY_LABEL']);
                        resolve(false);
                    }
                });
            })

        });
    }

    update(index: number, updatedPKey: PKey): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (!updatedPKey.isValid()) {
                this.alertService.show(AlertType.ERROR, this.messages['INVALID'] + " " + this.messages['PKEY_LABEL']);
                resolve(false);
                return;
            }

            this.authService.getUser().subscribe((user: User) => {
                if (!(user instanceof AuthenticatedUser)) return;

                const postData = { sessionId: user.id, pkey: updatedPKey.toPostData(), index };
                this.restService.post(`${this.ENDPOINT}/CreateUpdatePKey`, postData).subscribe({
                    next: (result: any) => {
                        const pkeys = this.pkeys$.value;
                        pkeys[index] = updatedPKey;

                        this.save(pkeys);

                        resolve(true);
                    },
                    error: () => {
                        this.alertService.show(AlertType.ERROR, this.messages['INVALID'] + " " + this.messages['PKEY_LABEL']);
                        resolve(false);
                    }
                })
            });
        });
    }

    delete(index: number, closeCurrentPage: boolean): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            const postData = { sessionId: user.id, index };
            this.restService.post(`${this.ENDPOINT}/ApplyDefaultPKeys`, postData).subscribe({
                next: (result: any) => {
                    const pkeys = this.pkeys$.value;
                    pkeys.splice(index, 1);

                    this.save(pkeys);
                    if (closeCurrentPage) {
                        // this.navigationController.pop();
                    }
                },
                error: () => {
                    this.alertService.show(AlertType.ERROR, this.messages['INVALID'] + " " + this.messages['PKEY_LABEL']);
                }
            });
        });

    }

    resetDefault(): void {
        this.authService.getUser().subscribe((user: User) => {
            if (!(user instanceof AuthenticatedUser)) return;

            const postData = { sessionId: user.id };
            this.restService.post(`${this.ENDPOINT}/ApplyDefaultPKeys`, postData).subscribe({
                next: (result: any) => {
                    this.loadPKeysFromServer(result);
                },
                error: (err: Error) => {
                    this.alertService.show(AlertType.ERROR, "Error resetting pkeys");
                }
            })
        });
    }

    public loadPkeysFromStorage(): void {
        const pkeys: string | null = localStorage.getItem('pkeys');
        console.log(pkeys);
        if(pkeys == null) return;

        this.pkeys$.next(JSON.parse(pkeys) as PKey[]);
    }

    public loadPKeysFromServer(serverPKeys: any): void {
        const pkeys: PKey[] = [];
        serverPKeys.forEach((serverPKey: PKey) => {
            pkeys.push(PKey.fromServer(serverPKey));
        });
        this.pkeys$.next(pkeys);
        localStorage.setItem('pkeys', JSON.stringify(pkeys));
    }
}
