import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './body.html',
  styleUrls: ['./body.css']
})
export class BodyComponent {
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  submitRegister() {
    this.auth.register({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.success = 'User created successfully! You can now login.';
          this.error = '';
          // Redirect to login after 2 seconds
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error(err);
          this.error = err.error?.error || 'Registration failed!';
          this.success = '';
        }
      });
  }
}
