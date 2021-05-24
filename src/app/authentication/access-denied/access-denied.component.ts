import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
})
export class AccessDeniedComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  constructor(
    private identityService: IdentityService,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.identityService.isUserLoggedIn$.subscribe((loggedIn) => {
      this.isUserLoggedIn = loggedIn;
      this.cdr.detectChanges();
    });
  }
}
