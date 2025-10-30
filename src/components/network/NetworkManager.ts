import { IApi, IOrder, IProductResponse, IOrderResponse} from "../../types";
import { CDN_URL } from "../../utils/constants";

export class NetworkManager {
    api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>('/product/').then((data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        image: CDN_URL + item.image.replace(/\.svg$/i, '.png'),
      })),
    }));
    }

    createOrder(order: IOrder): Promise<IOrderResponse> {
        return this.api.post("/order/", order);
    }
}
