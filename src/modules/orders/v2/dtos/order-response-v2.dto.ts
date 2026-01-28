export class OrderResponseDtoV2 {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  deliveryType?: string;
  estimatedDeliveryDate?: Date;
}
