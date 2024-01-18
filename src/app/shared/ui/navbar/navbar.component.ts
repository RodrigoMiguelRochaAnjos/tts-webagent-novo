import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../../core/models/user/user.model';
import { AuthenticatedUser } from '../../../core/models/user/types/authenticated-user.model';
import { AuthService } from '../../../core/authentication/auth.service';
import { Route, Router } from '@angular/router';
import { IncompleteUser } from '../../../core/models/user/types/incomplete-user.model';
import { Balance } from '../../models/balance.model';
import { BalanceService } from '../../services/balance.service';
import { ModalControllerService } from '../../services/modal-controller.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy{
    user$!: Observable<User>;
    public routes: NavItem[] = [];

    @Input() side!: boolean;

    @HostBinding('style.display')
    public display: string = "block";
    public balance$!: Observable<Balance>;
    public modal$!: Observable<boolean>; 
    
    private userSubscription!: Subscription;

    constructor(
        private authService: AuthService,
        private balanceService: BalanceService,
        private modalService: ModalControllerService,
        private router: Router
    ) {
        
    }
    
    ngOnInit(): void {
        this.user$ = this.authService.getUser();
        this.balance$ = this.balanceService.getBalance();
        this.modal$ = this.modalService.getModal();
        
        this.userSubscription = this.user$.subscribe({
            next: (user: User) => {
                if(user instanceof AuthenticatedUser || user instanceof IncompleteUser) {
                    this.display = "block";
                    return;
                }
                
                this.display = "none";

                this.balanceService.fetchAccountBalance();
            }
        })

        this.routes = this.router.config
            .filter((route: Route) => route.path && route.title)
            .map((route: Route) => ({
                label: route.title,
                route: `/${route.path}`
            } as NavItem));
    }

    public formatUsername(user: User | null) : string {
        if(user == null) return "";

        const names: string[] = user.name.split(" ");

        if(names.length == 1) return names[0];

        return `${names[0]} ${names[names.length - 1]}`;
    }
    
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
    
    logout() : void {
        this.authService.logout();
    }
    
    toggleModal() {
        this.modalService.toggleModal();
    }
}

interface NavItem {
    label: string;
    route: string;
}