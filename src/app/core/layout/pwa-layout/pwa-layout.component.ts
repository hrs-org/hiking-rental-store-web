import { Component } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-pwa-layout',
  imports: [PwaHeaderComponent, RouterOutlet, BottomNavComponent],
  templateUrl: './pwa-layout.component.html',
  styleUrls: ['./pwa-layout.component.scss'],
})
export class PwaLayoutComponent {
  title = '';

  onTitleChange(newTitle: string) {
    this.title = newTitle;
  }
}
