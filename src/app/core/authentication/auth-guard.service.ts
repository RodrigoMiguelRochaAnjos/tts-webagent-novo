import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, takeUntil } from "rxjs";
import { AuthService } from "./auth.service";
import { User } from "../models/user/user.model";
import { AuthenticatedUser } from "../models/user/types/authenticated-user.model";
import { IncompleteUser } from "../models/user/types/incomplete-user.model";
import { DestroyService } from "../services/destroy.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {
    private currentPage: string = "";

    constructor(
        private authService: AuthService,
        private router: Router,
        private destroyService: DestroyService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.canActivateChild(route, state);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let canProceed: boolean = true;
        
        if ((state.url !== '/home' && state.url !== '/')){
            this.currentPage = state.url;
        }


        this.authService.getUser()
        .pipe(takeUntil(this.destroyService.getDestroyOrder()))
        .subscribe({
            next: (user: User) => {
                
                if ((state.url != '/' && state.url != '/home') && !(user instanceof AuthenticatedUser) && !(user instanceof IncompleteUser)  ) {
                    canProceed = false;

                    this.authService.logout();
                    
                    this.router.navigate(['home']);

                    return;
                }

                if (user instanceof IncompleteUser && state.url != '/settings'){
                    canProceed = false;

                    this.router.navigate(['settings']);
                    return;
                }

                if ((state.url === '/home' || state.url === '/') && user instanceof AuthenticatedUser){
                    canProceed = true;

                    this.router.navigate([this.currentPage === '' ? '/neo' : this.currentPage]);
                    return;
                }
            }
        });

        return canProceed;
        
    }

}