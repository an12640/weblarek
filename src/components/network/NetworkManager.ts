import { IApi, IOrder, IProduct } from "../../types";

export class NetworkManager {
  api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/');
  }

  createOrder(order: IOrder): Promise<IOrder> {
    return this.api.post('/order/', order);
  }
  
  
}