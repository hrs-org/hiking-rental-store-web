import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { PwaHeaderComponent } from '../../../shared/components/pwa-header/pwa-header.component';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-pwa-layout',
  imports: [PwaHeaderComponent, RouterOutlet, BottomNavComponent],
  templateUrl: './pwa-layout.component.html',
  styleUrls: ['./pwa-layout.component.scss'],
})
export class PwaLayoutComponent implements AfterViewInit {
  private cd = inject(ChangeDetectorRef);
  title = '';

  onTitleChange(newTitle: string) {
    this.title = newTitle;
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
