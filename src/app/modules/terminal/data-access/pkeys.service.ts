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
        private destroyService: DestroyService,
        translate: TranslateService
    ) {
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
                // this.utilitiesService.showAlert(this.errorLabel, this.invalid + " " + this.pkeyLabel);
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
                        // this.utilitiesService.showAlert(this.errorLabel, result.message);
                        resolve(false);
                    }
                });
            })

        });
    }

    update(index: number, updatedPKey: PKey): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (!updatedPKey.isValid()) {
                // this.utilitiesService.showAlert(this.errorLabel, this.invalid + " " + this.pkeyLabel);
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
                        // this.utilitiesService.showAlert(this.errorLabel, result.message);
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
                    // this.utilitiesService.showAlert(this.errorLabel, result.message);
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
                    // this.loadService.loadPKeysFromServer(result.data);
                },
                error: (err: Error) => {
                    // this.utilitiesService.showAlert(this.errorLabel, result.message);
                }
            })
        });
    }
}
