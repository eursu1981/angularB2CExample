import { Component, OnInit } from '@angular/core';
import { AppUser } from '../authentication/app-user.model';
import { IdentityService } from '../authentication/identity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile!: AppUser;

  constructor(private identityService: IdentityService) {}

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.identityService.currentUser$.subscribe((user) => {
      if (user) {
        this.profile = user;
      }
    });
  }
}
