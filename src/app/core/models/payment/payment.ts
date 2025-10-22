export interface PaymentRequest {
  amount: number;
  orderId: string;
}

export interface PaymentVerifyRequestDto {
  secretKey: string;
}
