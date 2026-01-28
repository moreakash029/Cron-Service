export class OrderEntity {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  deliveryType?: string;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }

  // define methods here
  isPaid(): boolean {
    return this.status === 'PAID';
  }
}
