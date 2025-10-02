import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../../core/models/item/item';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-items',
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  readonly panelOpenState = signal(false);
  private readonly router = inject(Router);
  private readonly itemService = inject(ItemService);
  @Input() item!: Item;
  @Input() isExpanded = false;

  get hasChildren(): boolean {
    return this.item.children.length > 0;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  onClickEdit() {
    this.router.navigate(['add-edit-item', this.item.id]);
  }

  onClickDelete(itemId: number) {
    if (confirm(`Are you sure you want to delete item: ${this.item.name}?`)) {
      this.itemService.deleteItem(itemId).subscribe(() => {
        console.log(`Item with id ${itemId} deleted`);
        window.location.reload();
      });
    }
  }
}
