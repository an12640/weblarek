export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash" | "";
export type TProductId = string;
export type TPrice = number | null;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods,
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: TPrice;
}
export interface IProductResponse {
    total: number;
    items: IProduct[];
}

export interface ICustomer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends ICustomer {
    total: number;
    items: TProductId[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}
