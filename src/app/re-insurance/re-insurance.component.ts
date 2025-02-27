import { Component } from '@angular/core';

@Component({
  selector: 'app-re-insurance',
  templateUrl: './re-insurance.component.html',
  styleUrl: './re-insurance.component.scss'
})
export class ReInsuranceComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
