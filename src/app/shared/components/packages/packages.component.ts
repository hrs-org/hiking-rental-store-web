import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package } from '../../../core/models/package/package';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { PackageService } from '../../../core/services/package.service';

@Component({
  selector: 'app-packages',
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss',
})
export class PackagesComponent {
  readonly panelOpenState = signal(false);
  private readonly router = inject(Router);
  private readonly packageService = inject(PackageService);
  @Input() packages: Package = {
    name: '',
    description: '',
    basePrice: 0,
    items: [],
    rates: [],
  };
  @Input() isExpanded = false;

  get hasItems(): boolean {
    return this.packages.items.length > 0;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  onClickEdit() {
    this.router.navigate(['add-edit-package', this.packages.id]);
  }

  onClickDelete(packageId: number) {
    if (confirm(`Are you sure you want to delete package: ${this.packages.name}?`)) {
      this.packageService.deletePackage(packageId).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
