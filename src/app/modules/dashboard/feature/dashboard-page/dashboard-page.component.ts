import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { UserService } from 'src/app/core/authentication/user/user.service';
import { User } from 'src/app/core/models/user/user.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit{

    user$!: Observable<User>;

    constructor(
        private authService: AuthService
    ) {
    }
    ngOnInit(): void {
        this.user$ = this.authService.getUser();
    }
}
