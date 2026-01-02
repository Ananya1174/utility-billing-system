import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProfileComponent } from '../update-profile/update-profile';
import { ChangePasswordComponent } from '../change-password/change-password';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UpdateProfileComponent,ChangePasswordComponent
  ],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  activeTab: 'profile' | 'password' = 'profile';
}