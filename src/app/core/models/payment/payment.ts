export interface PaymentRequest {
  amount: number;
  orderId: number;
}

export interface PaymentVerifyRequestDto {
  secretKey: string;
}
