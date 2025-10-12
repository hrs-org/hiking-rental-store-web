import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { Item } from '../models/item/item';
import { ITEM_PREFIX } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ItemService {
  http = inject(HttpClient);

  // get item by id
  getItemById(itemId: number) {
    return this.http.get<ApiResponse<Item>>(`${ITEM_PREFIX}/${itemId}`);
  }
  // get all items
  getAllItems() {
    return this.http.get<ApiResponse<Item[]>>(`${ITEM_PREFIX}`);
  }

  // add item
  addItem(item: Item) {
    return this.http.post<ApiResponse<Item>>(`${ITEM_PREFIX}`, item);
  }

  // update item
  updateItem(item: Item) {
    return this.http.put<ApiResponse<Item>>(`${ITEM_PREFIX}/${item.id}`, item);
  }

  // delete item
  deleteItem(itemId: number) {
    return this.http.delete<ApiResponse<null>>(`${ITEM_PREFIX}/${itemId}`);
  }
}
