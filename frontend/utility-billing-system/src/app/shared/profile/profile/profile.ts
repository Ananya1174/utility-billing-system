import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { MyAccountComponent } from '../my-account/my-account';
import { ProfileDetailsComponent } from '../profile-details/profile-details';
import { ChangePasswordComponent } from '../change-password/change-password';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    MyAccountComponent,
    ProfileDetailsComponent,
    ChangePasswordComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {

  activeTab: 'account' | 'profile' | 'password' = 'account';

  constructor(private authService: AuthService) {}

  isConsumer(): boolean {
    return this.authService.getRole() === 'CONSUMER';
  }
}
