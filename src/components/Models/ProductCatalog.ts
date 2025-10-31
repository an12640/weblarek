import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductCatalog {
    products: IProduct[] = [];
    selectedProduct: IProduct | null = null;

    protected events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this.events = events;
    }
    
    getProducts(): IProduct[] {
        return this.products;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('catalog:setSelectedProduct', product);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
