import { IApi, IOrder, IProductResponse, IOrderResponse} from "../../types";

export class NetworkManager {
    api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductResponse> {
        return this.api.get("/product/");
    }

    createOrder(order: IOrder): Promise<IOrderResponse> {
        return this.api.post("/order/", order);
    }
}
