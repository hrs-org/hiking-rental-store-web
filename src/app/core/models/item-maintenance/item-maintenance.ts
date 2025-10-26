export interface ItemMaintenance {
  id: string;
  itemId: number;
  rentalOrderId: number;
  type: ItemMaintenanceType;
  quantity: number;
  quantityFixed: number;
  remarks: string;
}

export enum ItemMaintenanceType {
  Repair = 'Repair',
  Fixed = 'Fixed',
  Lost = 'Lost',
  Broken = 'Broken',
}

export interface ItemMaintenanceFixRequest {
  id: string;
  quantityFixed: number;
  remarks?: string;
}
