interface BaseOrder {
  customerId?: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  storeId: number;
  startDate: Date;
  endDate: Date;
  channel: OrderChannel;
  paymentType: OrderPaymentType;
}

export interface OrderRequest extends BaseOrder {
  items?: BaseOrderItem[];
  packages?: BaseOrderPackage[];
}

export interface Order extends BaseOrder {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  packages: OrderPackage[];
}

export enum OrderStatus {
  Pending = 'Pending',
  PendingPayment = 'PendingPayment',
  Booked = 'Booked',
  Rented = 'Rented',
  Returned = 'Returned',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum OrderChannel {
  Online = 'Online',
  POS = 'POS',
  Manual = 'Manual',
}

export enum OrderPaymentType {
  Cash = 'Cash',
  Other = 'Other',
}

export interface BaseOrderItem {
  itemId: string;
  quantity: number;
}

export interface BaseOrderPackage {
  packageId: string;
  quantity: number;
}

export interface OrderItem extends BaseOrderItem {
  id: string;
  itemNameSnapshot: string;
  dailyRateSnapshot: number;
}

export interface OrderPackage extends BaseOrderPackage {
  id: string;
  packageNameSnapshot: string;
  dailyRateSnapshot: number;
  items: OrderPackageItem[];
}

export interface OrderPackageItem {
  id: string;
  itemId: string;
  itemNameSnapshot: string;
  quantityPerPackageSnapshot: number;
}

export interface ReturnRentalOrderItem {
  rentalOrderItemId: string;
  goodQty: number;
  repairQty: number;
  damagedQty: number;
  lostQty: number;
}

export interface ReturnRentalOrderItemRequest {
  items: ReturnRentalOrderItem[];
}
