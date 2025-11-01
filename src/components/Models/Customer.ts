import { ICustomer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export type TCustomerErrors = Partial<Record<keyof ICustomer, string>>;
export type TOrderErrors = Pick<TCustomerErrors, 'payment' | 'address'>;
export type TContactsErrors = Pick<TCustomerErrors, 'email' | 'phone'>;

export class Customer {    
    payment: TPayment | null = null;
    address: string = "";
    email: string = "";
    phone: string = "";

    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial<ICustomer>) {
        if (data.payment) {
            this.payment = data.payment;
            this.events.emit('checkout:orderUpdated');
        }
        if (data.address) {
            this.address = data.address;
            this.events.emit('checkout:orderUpdated');
        }
        if (data.email) {
            this.email = data.email;
            this.events.emit('checkout:contactsUpdated');
        }
        if (data.phone) {
            this.phone = data.phone;
            this.events.emit('checkout:contactsUpdated');
        }
    }

    getData(): ICustomer {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = "";
        this.email = "";
        this.phone = "";
    }

    validateData(): TCustomerErrors {
        const errors: TCustomerErrors = {};
        if (!this.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.address) errors.address = "Укажите адрес доставки";
        if (!this.email) errors.email = "Укажите email";
        if (!this.phone) errors.phone = "Укажите телефон";
        return errors;
    }

    validateOrder(): TOrderErrors {
        const errors: TOrderErrors = {};
        if (!this.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.address) errors.address = "Укажите адрес доставки";
        return errors;
    }

    validateContacts(): TContactsErrors {
        const errors: TContactsErrors = {};
        if (!this.email) errors.email = "Укажите email";
        if (!this.phone) errors.phone = "Укажите телефон";
        return errors;
    }
}
