export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPING = "shipping",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING_PAYMENT = "pending_payment",
}

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  REFUNDED = "refunded",
}
