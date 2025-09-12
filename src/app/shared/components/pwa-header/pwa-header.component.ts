import { Location, NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pwa-header',
  imports: [MatIcon, NgStyle],
  templateUrl: './pwa-header.component.html',
  styleUrl: './pwa-header.component.scss',
})
export class PwaHeaderComponent {
  @Input() title = 'Default Title';
  @Input() backButtonVisible = false;

  location = inject(Location);

  backButton() {
    this.location.back();
  }
}
