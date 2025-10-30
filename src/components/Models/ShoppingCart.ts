import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ShoppingCart {
    items: IProduct[] = [];

    protected events: EventEmitter;
    
    constructor(events: EventEmitter) {
        this.events = events;
    }
    
    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:updated');
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter((item) => item.id !== product.id);
    }

    clear(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}
