import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrls: ['./header.css'], 
    imports: [RouterLink, CommonModule]
})
export class HeaderComponent {}
