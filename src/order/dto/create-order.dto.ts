import { LineItem } from '../model/line-item.vo';

export class CreateOrderDto {
  consumerId: string;
  lineItems: Array<LineItem>;
}
