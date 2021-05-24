import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IdentityService } from '../authentication/identity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  constructor(
    private identityService: IdentityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.identityService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.loginDisplay = isLoggedIn;
      this.cdr.detectChanges();
    });
  }
}
