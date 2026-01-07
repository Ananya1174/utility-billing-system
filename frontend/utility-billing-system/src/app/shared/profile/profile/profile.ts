import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { MyAccountComponent } from '../my-account/my-account';
import { ChangePasswordComponent } from '../change-password/change-password';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    MyAccountComponent,
    ChangePasswordComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {

  activeTab: 'account' | 'password' = 'account';
}